import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TransactionsRepository } from './repository/transactions.repository';
import { TransactionStatus } from './schema/transaction.schema';
import { PropertiesService } from '../properties/properties.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import { PropertyStatus } from '../properties/schema/property.schema';
import { Types } from 'mongoose';

@Injectable()
export class PaymentsService {
  private readonly paystackSecretKey: string;

  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly propertiesService: PropertiesService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.paystackSecretKey = this.configService.get<string>('paystack.secretKey') || '';
  }

  async initializePayment(propertyId: string, buyerId: string) {
    const property = await this.propertiesService.findById(propertyId);
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    
    if (![PropertyStatus.AVAILABLE, PropertyStatus.ACTIVE].includes(property.status)) {
      throw new BadRequestException('Property is no longer available');
    }

    const buyer = await this.usersService.findById(buyerId);
    if (!buyer) {
      throw new NotFoundException('Buyer not found');
    }

    const amountInKobo = Math.round(property.price * 100);
    const reference = crypto.randomBytes(8).toString('hex') + '-' + Date.now();

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: buyer.email,
        amount: amountInKobo,
        reference: reference,
        callback_url: `${this.configService.get<string>('cors.origin')}/payment/verify`,
        metadata: {
          propertyId: property.id,
          buyerId: buyer.id,
        }
      }),
    });

    const data = await response.json();
    if (!data.status) {
      this.logger.error('Paystack initialization failed', data);
      throw new BadRequestException('Failed to initialize payment gateway');
    }

    // Save pending transaction
    await this.transactionsRepository.create({
      property: property._id,
      buyer: buyer._id,
      vendor: property.agent as unknown as Types.ObjectId,
      amount: property.price,
      reference: reference,
      status: TransactionStatus.PENDING,
    });

    return {
      authorizationUrl: data.data.authorization_url,
      reference,
    };
  }

  async verifyPayment(reference: string) {
    const transaction = await this.transactionsRepository.findByReference(reference);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status === TransactionStatus.SUCCESS) {
      return {
        status: TransactionStatus.SUCCESS,
        message: 'Payment already verified',
      };
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.paystackSecretKey}`,
      },
    });

    const data = await response.json();
    
    if (!data.status) {
      throw new BadRequestException('Verification failed with Paystack');
    }

    if (data.data.status === 'success') {
      // Update transaction status
      await this.transactionsRepository.updateStatus(reference, TransactionStatus.SUCCESS);
      
      // Mark property as sold
      const propertyId =
        typeof transaction.property === 'object' &&
        transaction.property !== null &&
        '_id' in (transaction.property as any)
          ? (transaction.property as any)._id.toString()
          : transaction.property.toString();
      await this.propertiesService.updatePropertyStatus(propertyId, 'sold');

      // Send settlement emails asynchronously
      try {
        const buyerEmail = (transaction.buyer as any).email;
        const vendorEmail = (transaction.vendor as any).email;
        const title = (transaction.property as any).title;
        
        this.mailService.sendSettlementSuccessAlert(
          buyerEmail,
          vendorEmail,
          title,
          transaction.amount
        ).catch(e => {
            this.logger.error('Failed to send async settlement emails', e);
        });
      } catch (err) {
        this.logger.error('Failed to parse user emails for settlement receipt', err);
      }

      this.logger.info(`Payment verified and settled successfully for property ${propertyId}`);
      return {
        status: TransactionStatus.SUCCESS,
        message: 'Payment verified and property marked as sold',
      };
    } else {
      await this.transactionsRepository.updateStatus(reference, TransactionStatus.FAILED);
      throw new BadRequestException(`Payment was not successful. Paystack status: ${data.data.status}`);
    }
  }

  async getPurchasesForBuyer(buyerId: string) {
    return this.transactionsRepository.findSuccessfulByBuyer(buyerId);
  }
}
