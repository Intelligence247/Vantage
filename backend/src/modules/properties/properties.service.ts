import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PropertiesRepository } from './repository/properties.repository';
import { PropertyDocument } from './schema/property.schema';
import {
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyQueryInput,
} from './dto/property.dto';
import { Property } from './schema/property.schema';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly propertiesRepository: PropertiesRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    agentId: string,
    input: CreatePropertyInput,
  ): Promise<PropertyDocument> {
    const property = await this.propertiesRepository.create({
      ...input,
      agent: agentId as unknown as Property['agent'],
    });
    this.logger.info('Property created', {
      propertyId: property.id,
      agentId,
    });
    return property;
  }

  async findById(id: string): Promise<PropertyDocument> {
    const property = await this.propertiesRepository.findById(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    await this.propertiesRepository.incrementViews(id);
    return property;
  }

  async findAll(query: PropertyQueryInput): Promise<{
    properties: PropertyDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = this.buildFilter(query);
    const sort = this.buildSort(query.sort, query.order);

    const [properties, total] = await Promise.all([
      this.propertiesRepository.findAll(filter, skip, limit, sort),
      this.propertiesRepository.count(filter),
    ]);

    return {
      properties,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findFeatured(limit = 6): Promise<PropertyDocument[]> {
    return this.propertiesRepository.findAll(
      { isFeatured: true, status: 'available' },
      0,
      limit,
    );
  }

  async findByAgent(
    agentId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    properties: PropertyDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter = { agent: agentId };
    const [properties, total] = await Promise.all([
      this.propertiesRepository.findAll(filter, skip, limit),
      this.propertiesRepository.count(filter),
    ]);
    return {
      properties,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    agentId: string,
    input: UpdatePropertyInput,
    isAdmin = false,
  ): Promise<PropertyDocument> {
    const property = await this.propertiesRepository.findById(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (!isAdmin && property.agent?.toString() !== agentId) {
      throw new ForbiddenException(
        'You can only update your own properties',
      );
    }

    const updated = await this.propertiesRepository.update(id, input);
    if (!updated) {
      throw new NotFoundException('Property not found');
    }
    this.logger.info('Property updated', { propertyId: id });
    return updated;
  }

  async delete(
    id: string,
    agentId: string,
    isAdmin = false,
  ): Promise<void> {
    const property = await this.propertiesRepository.findById(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (!isAdmin && property.agent?.toString() !== agentId) {
      throw new ForbiddenException(
        'You can only delete your own properties',
      );
    }

    await this.propertiesRepository.delete(id);
    this.logger.info('Property deleted', { propertyId: id });
  }

  async addImages(
    id: string,
    images: Array<{ url: string; publicId: string }>,
  ): Promise<PropertyDocument> {
    const property = await this.propertiesRepository.update(id, {
      $push: { images: { $each: images } },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return property;
  }

  async removeImage(
    id: string,
    publicId: string,
  ): Promise<PropertyDocument> {
    const property = await this.propertiesRepository.update(id, {
      $pull: { images: { publicId } },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return property;
  }

  async toggleFavorite(
    propertyId: string,
    userId: string,
  ): Promise<{ isFavorited: boolean }> {
    const property = await this.propertiesRepository.findById(propertyId);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const isFavorited = property.favoritedBy.some(
      (id) => id.toString() === userId,
    );

    if (isFavorited) {
      await this.propertiesRepository.removeFromFavorites(propertyId, userId);
      return { isFavorited: false };
    } else {
      await this.propertiesRepository.addToFavorites(propertyId, userId);
      return { isFavorited: true };
    }
  }

  async getFavorites(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    properties: PropertyDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      this.propertiesRepository.findFavorites(userId, skip, limit),
      this.propertiesRepository.countFavorites(userId),
    ]);
    return {
      properties,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getPropertyStats(agentId?: string): Promise<{
    totalProperties: number;
    activeProperties: number;
    pendingProperties: number;
    soldProperties: number;
    totalViews: number;
    totalLeads: number;
  }> {
    const baseFilter: Record<string, any> = agentId
      ? { agent: agentId }
      : {};

    const [
      totalProperties,
      activeProperties,
      pendingProperties,
      soldProperties,
    ] = await Promise.all([
      this.propertiesRepository.count(baseFilter),
      this.propertiesRepository.count({ ...baseFilter, status: 'available' }),
      this.propertiesRepository.count({ ...baseFilter, status: 'pending' }),
      this.propertiesRepository.count({ ...baseFilter, status: 'sold' }),
    ]);

    const viewsAndLeads = await this.propertiesRepository.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalLeads: { $sum: '$leads' },
        },
      },
    ]);

    const stats = viewsAndLeads[0] as
      | { totalViews: number; totalLeads: number }
      | undefined;

    return {
      totalProperties,
      activeProperties,
      pendingProperties,
      soldProperties,
      totalViews: stats?.totalViews ?? 0,
      totalLeads: stats?.totalLeads ?? 0,
    };
  }

  async approveProperty(id: string): Promise<PropertyDocument> {
    const property = await this.propertiesRepository.update(id, {
      status: 'available',
      isVerified: true,
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    this.logger.info('Property approved', { propertyId: id });
    return property;
  }

  async getPendingProperties(
    page = 1,
    limit = 20,
  ): Promise<{
    properties: PropertyDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter = { status: 'pending' };
    const [properties, total] = await Promise.all([
      this.propertiesRepository.findAll(filter, skip, limit),
      this.propertiesRepository.count(filter),
    ]);
    return {
      properties,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  private buildFilter(
    query: PropertyQueryInput,
  ): Record<string, any> {
    const filter: Record<string, any> = {};

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { address: { $regex: query.search, $options: 'i' } },
        { city: { $regex: query.search, $options: 'i' } },
        { state: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.propertyKind) {
      filter.propertyKind = query.propertyKind;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.state) {
      filter.state = { $regex: query.state, $options: 'i' } as unknown as string;
    }

    if (query.city) {
      filter.city = { $regex: query.city, $options: 'i' } as unknown as string;
    }

    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) {
        (filter.price as Record<string, number>).$gte = parseInt(
          query.minPrice,
          10,
        );
      }
      if (query.maxPrice) {
        (filter.price as Record<string, number>).$lte = parseInt(
          query.maxPrice,
          10,
        );
      }
    }

    if (query.beds) {
      filter.beds = { $gte: parseInt(query.beds, 10) };
    }

    if (query.baths) {
      filter.baths = { $gte: parseInt(query.baths, 10) };
    }

    return filter;
  }

  private buildSort(
    sort?: string,
    order?: string,
  ): Record<string, 1 | -1> {
    const sortField = sort || 'createdAt';
    const sortOrder: 1 | -1 = order === 'asc' ? 1 : -1;
    return { [sortField]: sortOrder };
  }
}
