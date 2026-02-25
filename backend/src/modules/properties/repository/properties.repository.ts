import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery, PipelineStage } from 'mongoose';
import { Property, PropertyDocument } from '../schema/property.schema';

@Injectable()
export class PropertiesRepository {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<PropertyDocument>,
  ) {}

  async create(data: Partial<Property>): Promise<PropertyDocument> {
    const property = new this.propertyModel(data);
    return property.save();
  }

  async findOne(
    filter: Record<string, any>,
  ): Promise<PropertyDocument | null> {
    return this.propertyModel
      .findOne(filter)
      .populate('agent', 'name email phone avatar isVerified role')
      .exec();
  }

  async findById(id: string): Promise<PropertyDocument | null> {
    return this.propertyModel
      .findById(id)
      .populate('agent', 'name email phone avatar isVerified role')
      .exec();
  }

  async findAll(
    filter: Record<string, any> = {},
    skip = 0,
    limit = 20,
    sort: Record<string, 1 | -1> = { createdAt: -1 },
  ): Promise<PropertyDocument[]> {
    return this.propertyModel
      .find(filter)
      .populate('agent', 'name email phone avatar isVerified role')
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    return this.propertyModel.countDocuments(filter).exec();
  }

  async update(
    id: string,
    data: UpdateQuery<Property>,
  ): Promise<PropertyDocument | null> {
    return this.propertyModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('agent', 'name email phone avatar isVerified role')
      .exec();
  }

  async delete(id: string): Promise<PropertyDocument | null> {
    return this.propertyModel.findByIdAndDelete(id).exec();
  }

  async incrementViews(id: string): Promise<void> {
    await this.propertyModel.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
  }

  async incrementLeads(id: string): Promise<void> {
    await this.propertyModel.findByIdAndUpdate(id, { $inc: { leads: 1 } }).exec();
  }

  async aggregate(pipeline: PipelineStage[]): Promise<unknown[]> {
    return this.propertyModel.aggregate(pipeline).exec();
  }

  async addToFavorites(
    propertyId: string,
    userId: string,
  ): Promise<PropertyDocument | null> {
    return this.propertyModel
      .findByIdAndUpdate(
        propertyId,
        { $addToSet: { favoritedBy: userId } },
        { new: true },
      )
      .exec();
  }

  async removeFromFavorites(
    propertyId: string,
    userId: string,
  ): Promise<PropertyDocument | null> {
    return this.propertyModel
      .findByIdAndUpdate(
        propertyId,
        { $pull: { favoritedBy: userId } },
        { new: true },
      )
      .exec();
  }

  async findFavorites(
    userId: string,
    skip = 0,
    limit = 20,
  ): Promise<PropertyDocument[]> {
    return this.propertyModel
      .find({ favoritedBy: userId } as any)
      .populate('agent', 'name email phone avatar isVerified role')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async countFavorites(userId: string): Promise<number> {
    return this.propertyModel.countDocuments({ favoritedBy: userId } as any).exec();
  }
}
