import {
  Injectable,
  NotFoundException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { InquiriesGateway } from './inquiries.gateway';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InquiriesRepository } from './repository/inquiries.repository';
import {
  InquiryDocument,
  Inquiry,
  InquiryStatus,
  InquiryParticipantRole,
} from './schema/inquiry.schema';
import { CreateInquiryInput, ContactFormInput, ReplyInquiryInput } from './dto/inquiry.dto';
import { PropertiesRepository } from '../properties/repository/properties.repository';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { JwtPayload } from '../../common/decorators';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class InquiriesService {
  constructor(
    private readonly inquiriesRepository: InquiriesRepository,
    private readonly propertiesRepository: PropertiesRepository,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly inquiriesGateway: InquiriesGateway,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createInquiry(
    input: CreateInquiryInput,
    senderId?: string,
  ): Promise<InquiryDocument> {
    const property = await this.propertiesRepository.findById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const inquiry = await this.inquiriesRepository.create({
      property: input.propertyId as unknown as Inquiry['property'],
      agent: property.agent as Inquiry['agent'],
      sender: senderId
        ? (senderId as unknown as Inquiry['sender'])
        : undefined,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      messages: [
        {
          sender: senderId ? (senderId as unknown as Inquiry['sender']) : undefined,
          senderRole: InquiryParticipantRole.BUYER,
          body: input.message,
          createdAt: new Date(),
        },
      ],
    });

    await this.propertiesRepository.incrementLeads(input.propertyId);

    this.logger.info('Inquiry created', {
      inquiryId: inquiry.id,
      propertyId: input.propertyId,
    });

    // Fire email alert to Vendor
    try {
      const vendorId = property.agent?.toString() || property.agent;
      if (vendorId) {
        const vendor = await this.usersService.findById(vendorId as string);
        this.mailService.sendVendorInquiryAlert(
          vendor.email, 
          vendor.name, 
          property.title, 
          input.name, 
          input.message
        ).catch(e => {
            this.logger.error('Failed to send async vendor inquiry email', e);
        });
      }
    } catch (error) {
      this.logger.error('Failed to lookup vendor for new inquiry email', error);
    }

    this.inquiriesGateway.notifyInquiryParticipants(inquiry);

    return inquiry;
  }

  async createContactMessage(
    input: ContactFormInput,
  ): Promise<{ message: string }> {
    this.logger.info('Contact form submitted', {
      name: input.name,
      email: input.email,
      subject: input.subject,
    });

    return { message: 'Contact message received. We will get back to you shortly.' };
  }

  async getAgentInquiries(
    agentId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    inquiries: InquiryDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter = { agent: agentId };
    const [inquiries, total] = await Promise.all([
      this.inquiriesRepository.findAll(filter, skip, limit),
      this.inquiriesRepository.count(filter),
    ]);
    return {
      inquiries,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getUserInquiries(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    inquiries: InquiryDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter = { sender: userId };
    const [inquiries, total] = await Promise.all([
      this.inquiriesRepository.findAll(filter, skip, limit),
      this.inquiriesRepository.count(filter),
    ]);
    return {
      inquiries,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getInquiryById(id: string): Promise<InquiryDocument> {
    const inquiry = await this.inquiriesRepository.findById(id);
    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }
    return inquiry;
  }

  async updateInquiryStatus(
    id: string,
    status: string,
  ): Promise<InquiryDocument> {
    const inquiry = await this.inquiriesRepository.update(id, {
      status: status as InquiryDocument['status'],
    });
    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }
    this.logger.info('Inquiry status updated', {
      inquiryId: id,
      status,
    });
    return inquiry;
  }

  async replyToInquiry(
    id: string,
    agentId: string,
    input: ReplyInquiryInput,
  ): Promise<InquiryDocument> {
    const inquiry = await this.inquiriesRepository.findById(id);
    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }

    const inquiryAgentId =
      typeof inquiry.agent === 'object' &&
      inquiry.agent !== null &&
      '_id' in (inquiry.agent as any)
        ? (inquiry.agent as any)._id.toString()
        : inquiry.agent?.toString();

    if (inquiryAgentId !== agentId) {
      throw new NotFoundException('You can only reply to your own inquiries');
    }

    const updatedInquiry = await this.inquiriesRepository.update(id, {
      status: InquiryStatus.RESPONDED,
      message: input.message,
      $push: {
        messages: {
          sender: agentId as unknown as Inquiry['agent'],
          senderRole: InquiryParticipantRole.AGENT,
          body: input.message,
          createdAt: new Date(),
        },
      } as any,
    });

    if (!updatedInquiry) {
      throw new NotFoundException('Inquiry not found after updating');
    }

    try {
      const agent = await this.usersService.findById(agentId);
      const property = await this.propertiesRepository.findById(inquiry.property.toString());
      
      let buyerName = inquiry.name;
      let buyerEmail = inquiry.email;
      
      if (inquiry.sender) {
        try {
          const buyer = await this.usersService.findById(inquiry.sender.toString());
          buyerName = buyer.name;
          buyerEmail = buyer.email;
        } catch (err) {
          this.logger.warn('Failed to find registered buyer profile for inquiry email, using raw form fields');
        }
      }

      this.mailService.sendBuyerReplyEmail(
        buyerEmail, 
        buyerName, 
        property ? property.title : 'Listing', 
        agent.name, 
        input.message
      ).catch(e => {
        this.logger.error('Failed to send async buyer reply email', e);
      });
      
    } catch (error) {
      this.logger.error('Failed to process agent reply to inquiry', error);
    }

    this.inquiriesGateway.notifyInquiryParticipants(updatedInquiry);

    return updatedInquiry;
  }

  assertInquiryParticipant(inquiry: InquiryDocument, user: JwtPayload): void {
    const inquiryAgentId =
      typeof inquiry.agent === 'object' &&
      inquiry.agent !== null &&
      '_id' in (inquiry.agent as any)
        ? (inquiry.agent as any)._id.toString()
        : inquiry.agent?.toString();
    const inquirySenderId =
      typeof inquiry.sender === 'object' &&
      inquiry.sender !== null &&
      '_id' in (inquiry.sender as any)
        ? (inquiry.sender as any)._id.toString()
        : inquiry.sender?.toString();

    const isAdmin = user.role === Role.ADMIN;
    const isAgent = inquiryAgentId === user.sub;
    const isBuyer = inquirySenderId === user.sub;

    if (!isAdmin && !isAgent && !isBuyer) {
      throw new ForbiddenException('You are not allowed in this conversation');
    }
  }

  async sendMessage(
    inquiryId: string,
    user: JwtPayload,
    message: string,
  ): Promise<InquiryDocument> {
    const inquiry = await this.inquiriesRepository.findById(inquiryId);
    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }

    this.assertInquiryParticipant(inquiry, user);

    const inquiryAgentId =
      typeof inquiry.agent === 'object' &&
      inquiry.agent !== null &&
      '_id' in (inquiry.agent as any)
        ? (inquiry.agent as any)._id.toString()
        : inquiry.agent?.toString();
    const inquirySenderId =
      typeof inquiry.sender === 'object' &&
      inquiry.sender !== null &&
      '_id' in (inquiry.sender as any)
        ? (inquiry.sender as any)._id.toString()
        : inquiry.sender?.toString();

    const isAdmin = user.role === Role.ADMIN;
    const isAgent = inquiryAgentId === user.sub;
    const isBuyer = inquirySenderId === user.sub;

    const senderRole = isAdmin
      ? InquiryParticipantRole.ADMIN
      : isAgent
      ? InquiryParticipantRole.AGENT
      : InquiryParticipantRole.BUYER;

    const nextStatus =
      senderRole === InquiryParticipantRole.AGENT ||
      senderRole === InquiryParticipantRole.ADMIN
        ? InquiryStatus.RESPONDED
        : InquiryStatus.PENDING;

    const updated = await this.inquiriesRepository.update(inquiryId, {
      status: nextStatus,
      message,
      $push: {
        messages: {
          sender: user.sub as unknown as Inquiry['sender'],
          senderRole,
          body: message,
          createdAt: new Date(),
        },
      } as any,
    });

    if (!updated) {
      throw new NotFoundException('Inquiry not found');
    }

    this.inquiriesGateway.notifyInquiryParticipants(updated);

    return updated;
  }
}
