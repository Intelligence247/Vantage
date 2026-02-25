import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry, InquiryDocument } from '../schema/inquiry.schema';

@Injectable()
export class InquiriesRepository {
  constructor(
    @InjectModel(Inquiry.name)
    private readonly inquiryModel: Model<InquiryDocument>,
  ) {}

  async create(data: Partial<Inquiry>): Promise<InquiryDocument> {
    const inquiry = new this.inquiryModel(data);
    return inquiry.save();
  }

  async findById(id: string): Promise<InquiryDocument | null> {
    return this.inquiryModel
      .findById(id)
      .populate('property', 'title address price images')
      .populate('sender', 'name email avatar')
      .populate('agent', 'name email avatar')
      .exec();
  }

  async findAll(
    filter: Record<string, any> = {},
    skip = 0,
    limit = 20,
  ): Promise<InquiryDocument[]> {
    return this.inquiryModel
      .find(filter)
      .populate('property', 'title address price images')
      .populate('sender', 'name email avatar')
      .populate('agent', 'name email avatar')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    return this.inquiryModel.countDocuments(filter).exec();
  }

  async update(
    id: string,
    data: Partial<Inquiry>,
  ): Promise<InquiryDocument | null> {
    return this.inquiryModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }
}
