import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './repository/users.repository';
import { Role } from '../../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

const mockUsersRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  aggregate: jest.fn(),
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: 'winston', useValue: mockLogger },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue({
        id: 'user-id-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: Role.USER,
        isVerified: false,
      });

      const result = await service.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        role: Role.USER,
      });

      expect(result.id).toBe('user-id-1');
      expect(mockUsersRepository.create).toHaveBeenCalled();
    });

    it('should throw on duplicate email', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue({
        id: 'existing',
      });

      await expect(
        service.create({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123',
          role: Role.USER,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should hash password with 12 salt rounds', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.create.mockImplementation(async (data) => ({
        id: 'user-id-1',
        ...data,
      }));

      await service.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        role: Role.USER,
      });

      const createCall = mockUsersRepository.create.mock.calls[0][0] as { password: string };
      const isValidHash = await bcrypt.compare('Password123', createCall.password);
      expect(isValidHash).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: 'user-id-1',
        name: 'John Doe',
        email: 'john@example.com',
      };
      mockUsersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById('user-id-1');

      expect(result.id).toBe('user-id-1');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      mockUsersRepository.findAll.mockResolvedValue([
        { id: 'user-1' },
        { id: 'user-2' },
      ]);
      mockUsersRepository.count.mockResolvedValue(2);

      const result = await service.findAll(1, 20);

      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });
  });

  describe('changePassword', () => {
    it('should change password with valid current password', async () => {
      const hashedPassword = await bcrypt.hash('OldPassword1', 12);
      mockUsersRepository.findById.mockResolvedValue({
        id: 'user-id-1',
        password: hashedPassword,
      });
      mockUsersRepository.update.mockResolvedValue({});

      await service.changePassword('user-id-1', {
        currentPassword: 'OldPassword1',
        newPassword: 'NewPassword2',
      });

      expect(mockUsersRepository.update).toHaveBeenCalled();
    });

    it('should throw on incorrect current password', async () => {
      const hashedPassword = await bcrypt.hash('OldPassword1', 12);
      mockUsersRepository.findById.mockResolvedValue({
        id: 'user-id-1',
        password: hashedPassword,
      });

      await expect(
        service.changePassword('user-id-1', {
          currentPassword: 'WrongPassword1',
          newPassword: 'NewPassword2',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyAgent', () => {
    it('should verify an agent', async () => {
      mockUsersRepository.findById.mockResolvedValue({
        id: 'agent-id-1',
        role: 'agent',
      });
      mockUsersRepository.update.mockResolvedValue({
        id: 'agent-id-1',
        role: 'agent',
        isVerified: true,
      });

      const result = await service.verifyAgent('agent-id-1');
      expect(result.isVerified).toBe(true);
    });

    it('should throw if user is not an agent', async () => {
      mockUsersRepository.findById.mockResolvedValue({
        id: 'user-id-1',
        role: 'user',
      });

      await expect(service.verifyAgent('user-id-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('suspendUser', () => {
    it('should suspend a user', async () => {
      mockUsersRepository.update.mockResolvedValue({
        id: 'user-id-1',
        isSuspended: true,
      });

      const result = await service.suspendUser('user-id-1', true);
      expect(result.isSuspended).toBe(true);
    });

    it('should throw if user not found', async () => {
      mockUsersRepository.update.mockResolvedValue(null);

      await expect(
        service.suspendUser('nonexistent', true),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      mockUsersRepository.count
        .mockResolvedValueOnce(100) // totalUsers
        .mockResolvedValueOnce(30) // totalAgents
        .mockResolvedValueOnce(20) // verifiedAgents
        .mockResolvedValueOnce(10); // pendingVerifications

      const stats = await service.getUserStats();

      expect(stats.totalUsers).toBe(100);
      expect(stats.totalAgents).toBe(30);
      expect(stats.verifiedAgents).toBe(20);
      expect(stats.pendingVerifications).toBe(10);
    });
  });
});
