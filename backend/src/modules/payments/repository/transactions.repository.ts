import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transaction,
  TransactionDocument,
  TransactionStatus,
} from '../schema/transaction.schema';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async create(data: Partial<Transaction>): Promise<TransactionDocument> {
    const transaction = new this.transactionModel(data);
    return transaction.save();
  }

  async findByReference(reference: string): Promise<TransactionDocument | null> {
    return this.transactionModel.findOne({ reference }).populate('buyer property vendor').exec();
  }

  async updateStatus(reference: string, status: string): Promise<TransactionDocument | null> {
    return this.transactionModel.findOneAndUpdate(
      { reference },
      { $set: { status } },
      { returnDocument: 'after', runValidators: true }
    ).exec();
  }

  async findSuccessfulByBuyer(buyerId: string): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find({
        buyer: buyerId,
        status: TransactionStatus.SUCCESS,
      })
      .sort({ updatedAt: -1 })
      .populate('property')
      .populate({ path: 'vendor', select: 'name email phone' })
      .exec();
  }
}
