import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save();
  }

  async findOne(filter: Record<string, any>): Promise<UserDocument | null> {
    return this.userModel.findOne(filter).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findAll(
    filter: Record<string, any> = {},
    skip = 0,
    limit = 20,
  ): Promise<UserDocument[]> {
    return this.userModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    return this.userModel.countDocuments(filter).exec();
  }

  async update(
    id: string,
    data: UpdateQuery<User>,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async aggregate(pipeline: any[]): Promise<unknown[]> {
    return this.userModel.aggregate(pipeline).exec();
  }
}
