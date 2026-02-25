import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesRepository } from './repository/properties.repository';
import { PropertyType } from './schema/property.schema';

const mockPropertiesRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  incrementViews: jest.fn(),
  incrementLeads: jest.fn(),
  aggregate: jest.fn(),
  addToFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
  findFavorites: jest.fn(),
  countFavorites: jest.fn(),
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

describe('PropertiesService', () => {
  let service: PropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        { provide: PropertiesRepository, useValue: mockPropertiesRepository },
        { provide: 'winston', useValue: mockLogger },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a property', async () => {
      const mockProperty = {
        id: 'prop-id-1',
        title: 'Test Property',
        price: 1000000,
        type: PropertyType.SALE,
      };
      mockPropertiesRepository.create.mockResolvedValue(mockProperty);

      const result = await service.create('agent-id-1', {
        title: 'Test Property',
        description: 'A test property description',
        price: 1000000,
        type: PropertyType.SALE,
        features: [],
        is360: false,
        nearbyPlaces: [],
      });

      expect(result.id).toBe('prop-id-1');
      expect(mockPropertiesRepository.create).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a property by ID', async () => {
      const mockProperty = { id: 'prop-id-1', title: 'Test' };
      mockPropertiesRepository.findById.mockResolvedValue(mockProperty);
      mockPropertiesRepository.incrementViews.mockResolvedValue(undefined);

      const result = await service.findById('prop-id-1');
      expect(result.id).toBe('prop-id-1');
    });

    it('should throw NotFoundException', async () => {
      mockPropertiesRepository.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated properties', async () => {
      mockPropertiesRepository.findAll.mockResolvedValue([
        { id: 'prop-1' },
        { id: 'prop-2' },
      ]);
      mockPropertiesRepository.count.mockResolvedValue(2);

      const result = await service.findAll({
        page: '1',
        limit: '20',
        sort: 'createdAt',
        order: 'desc',
      });

      expect(result.properties).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should apply search filter', async () => {
      mockPropertiesRepository.findAll.mockResolvedValue([]);
      mockPropertiesRepository.count.mockResolvedValue(0);

      await service.findAll({
        page: '1',
        limit: '20',
        search: 'Lagos',
        sort: 'createdAt',
        order: 'desc',
      });

      const filter = mockPropertiesRepository.findAll.mock.calls[0][0] as Record<string, unknown>;
      expect(filter.$or).toBeDefined();
    });

    it('should apply price range filter', async () => {
      mockPropertiesRepository.findAll.mockResolvedValue([]);
      mockPropertiesRepository.count.mockResolvedValue(0);

      await service.findAll({
        page: '1',
        limit: '20',
        minPrice: '1000000',
        maxPrice: '5000000',
        sort: 'createdAt',
        order: 'desc',
      });

      const filter = mockPropertiesRepository.findAll.mock.calls[0][0] as Record<string, Record<string, number>>;
      expect(filter.price.$gte).toBe(1000000);
      expect(filter.price.$lte).toBe(5000000);
    });
  });

  describe('update', () => {
    it('should update property by owner', async () => {
      mockPropertiesRepository.findById.mockResolvedValue({
        id: 'prop-id-1',
        agent: { toString: () => 'agent-id-1' },
      });
      mockPropertiesRepository.update.mockResolvedValue({
        id: 'prop-id-1',
        title: 'Updated',
      });

      const result = await service.update('prop-id-1', 'agent-id-1', {
        title: 'Updated',
      });

      expect(result.title).toBe('Updated');
    });

    it('should throw ForbiddenException for non-owner', async () => {
      mockPropertiesRepository.findById.mockResolvedValue({
        id: 'prop-id-1',
        agent: { toString: () => 'agent-id-1' },
      });

      await expect(
        service.update('prop-id-1', 'different-agent', { title: 'Updated' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow admin to update any property', async () => {
      mockPropertiesRepository.findById.mockResolvedValue({
        id: 'prop-id-1',
        agent: { toString: () => 'agent-id-1' },
      });
      mockPropertiesRepository.update.mockResolvedValue({
        id: 'prop-id-1',
        title: 'Admin Updated',
      });

      const result = await service.update(
        'prop-id-1',
        'admin-id',
        { title: 'Admin Updated' },
        true,
      );

      expect(result.title).toBe('Admin Updated');
    });
  });

  describe('delete', () => {
    it('should delete property by owner', async () => {
      mockPropertiesRepository.findById.mockResolvedValue({
        id: 'prop-id-1',
        agent: { toString: () => 'agent-id-1' },
      });
      mockPropertiesRepository.delete.mockResolvedValue(undefined);

      await expect(
        service.delete('prop-id-1', 'agent-id-1'),
      ).resolves.toBeUndefined();
    });

    it('should throw ForbiddenException for non-owner', async () => {
      mockPropertiesRepository.findById.mockResolvedValue({
        id: 'prop-id-1',
        agent: { toString: () => 'agent-id-1' },
      });

      await expect(
        service.delete('prop-id-1', 'different-agent'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('toggleFavorite', () => {
    it('should add to favorites', async () => {
      mockPropertiesRepository.findById.mockResolvedValue({
        id: 'prop-id-1',
        favoritedBy: [],
      });
      mockPropertiesRepository.addToFavorites.mockResolvedValue({});

      const result = await service.toggleFavorite('prop-id-1', 'user-id-1');
      expect(result.isFavorited).toBe(true);
    });

    it('should remove from favorites', async () => {
      mockPropertiesRepository.findById.mockResolvedValue({
        id: 'prop-id-1',
        favoritedBy: [{ toString: () => 'user-id-1' }],
      });
      mockPropertiesRepository.removeFromFavorites.mockResolvedValue({});

      const result = await service.toggleFavorite('prop-id-1', 'user-id-1');
      expect(result.isFavorited).toBe(false);
    });
  });

  describe('getPropertyStats', () => {
    it('should return property statistics', async () => {
      mockPropertiesRepository.count
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(30) // active
        .mockResolvedValueOnce(15) // pending
        .mockResolvedValueOnce(5); // sold
      mockPropertiesRepository.aggregate.mockResolvedValue([
        { totalViews: 500, totalLeads: 100 },
      ]);

      const stats = await service.getPropertyStats();

      expect(stats.totalProperties).toBe(50);
      expect(stats.totalViews).toBe(500);
      expect(stats.totalLeads).toBe(100);
    });
  });

  describe('approveProperty', () => {
    it('should approve a pending property', async () => {
      mockPropertiesRepository.update.mockResolvedValue({
        id: 'prop-id-1',
        status: 'available',
        isVerified: true,
      });

      const result = await service.approveProperty('prop-id-1');
      expect(result.status).toBe('available');
      expect(result.isVerified).toBe(true);
    });

    it('should throw if property not found', async () => {
      mockPropertiesRepository.update.mockResolvedValue(null);

      await expect(
        service.approveProperty('nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
