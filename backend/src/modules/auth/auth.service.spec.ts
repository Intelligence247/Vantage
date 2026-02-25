import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums/role.enum';

const mockUsersService = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  updateRefreshToken: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      'jwt.accessSecret': 'test-access-secret',
      'jwt.refreshSecret': 'test-refresh-secret',
      'jwt.accessExpiresIn': '15m',
      'jwt.refreshExpiresIn': '7d',
    };
    return config[key];
  }),
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: 'winston', useValue: mockLogger },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      const mockUser = {
        id: 'user-id-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: Role.USER,
        isVerified: false,
      };

      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');
      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        role: Role.USER,
      });

      expect(result.user.id).toBe('user-id-1');
      expect(result.user.email).toBe('john@example.com');
      expect(result.tokens.accessToken).toBe('access-token');
      expect(result.tokens.refreshToken).toBe('refresh-token');
      expect(mockUsersService.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Password123', 12);
      const mockUser = {
        id: 'user-id-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: Role.USER,
        isVerified: false,
        isSuspended: false,
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');
      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.login({
        email: 'john@example.com',
        password: 'Password123',
      });

      expect(result.user.id).toBe('user-id-1');
      expect(result.tokens.accessToken).toBe('access-token');
    });

    it('should throw on invalid email', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'wrong@example.com',
          password: 'Password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw on invalid password', async () => {
      const hashedPassword = await bcrypt.hash('Password123', 12);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-id-1',
        password: hashedPassword,
        isSuspended: false,
      });

      await expect(
        service.login({
          email: 'john@example.com',
          password: 'WrongPassword1',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if user is suspended', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-id-1',
        isSuspended: true,
      });

      await expect(
        service.login({
          email: 'john@example.com',
          password: 'Password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should invalidate refresh token', async () => {
      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      await service.logout('user-id-1');

      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        'user-id-1',
        null,
      );
    });
  });

  describe('refreshTokens', () => {
    it('should throw if no refresh token stored', async () => {
      mockUsersService.findById.mockResolvedValue({
        id: 'user-id-1',
        hashedRefreshToken: null,
      });

      await expect(
        service.refreshTokens('user-id-1', 'some-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate a refresh token', async () => {
      const payload = {
        sub: 'user-id-1',
        email: 'john@example.com',
        role: Role.USER,
        isVerified: false,
      };
      mockJwtService.verifyAsync.mockResolvedValue(payload);

      const result = await service.validateRefreshToken('valid-token');

      expect(result.sub).toBe('user-id-1');
    });

    it('should throw on invalid token', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid'));

      await expect(
        service.validateRefreshToken('invalid-token'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
