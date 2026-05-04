import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './repository/users.repository';
import { UserDocument } from './schema/user.schema';
import {
  CreateUserInput,
  UpdateUserInput,
  ChangePasswordInput,
  UpdateNotificationPrefsInput,
  UploadKycInput,
} from './dto/user.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(input: CreateUserInput): Promise<UserDocument> {
    const existingUser = await this.usersRepository.findByEmail(input.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await this.usersRepository.create({
      ...input,
      password: hashedPassword,
    });

    this.logger.info('User created', { userId: user.id, email: user.email });
    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findAll(
    page = 1,
    limit = 20,
    role?: string,
  ): Promise<{ users: UserDocument[]; total: number; page: number; pages: number }> {
    const skip = (page - 1) * limit;
    const filter = role ? { role } : {};
    const [users, total] = await Promise.all([
      this.usersRepository.findAll(filter, skip, limit),
      this.usersRepository.count(filter),
    ]);
    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async update(id: string, input: UpdateUserInput): Promise<UserDocument> {
    const user = await this.usersRepository.update(id, input);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.logger.info('User updated', { userId: id });
    return user;
  }

  async uploadKycDocument(id: string, input: UploadKycInput): Promise<UserDocument> {
    const user = await this.usersRepository.update(id, input);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Fire off async email alert to admin
    this.mailService.sendAdminVendorAlert(user.name, user.email).catch(e => {
        this.logger.error('Failed to send Admin KYC Alert', e);
    });

    return user;
  }

  async changePassword(
    id: string,
    input: ChangePasswordInput,
  ): Promise<void> {
    const user = await this.findById(id);
    const isValid = await bcrypt.compare(input.currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 12);
    await this.usersRepository.update(id, { password: hashedPassword });
    this.logger.info('Password changed', { userId: id });
  }

  async updateNotificationPreferences(
    id: string,
    prefs: UpdateNotificationPrefsInput,
  ): Promise<UserDocument> {
    const user = await this.usersRepository.update(id, {
      notificationPreferences: prefs,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    const hashedRefreshToken = refreshToken
      ? await bcrypt.hash(refreshToken, 12)
      : undefined;
    await this.usersRepository.update(id, {
      hashedRefreshToken: hashedRefreshToken ?? null,
    });
  }

  async setEmailVerificationToken(
    id: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.usersRepository.update(id, {
      emailVerificationToken: token,
      emailVerificationTokenExpires: expiresAt,
    });
  }

  async verifyEmail(id: string): Promise<void> {
    await this.usersRepository.update(id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    });
  }

  async verifyAgent(id: string): Promise<UserDocument> {
    const user = await this.findById(id);
    if (user.role !== 'agent') {
      throw new BadRequestException('User is not an agent');
    }
    const updated = await this.usersRepository.update(id, {
      isVerified: true,
    });
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    this.logger.info('Agent verified', { userId: id });
    return updated;
  }

  async suspendUser(id: string, suspend: boolean): Promise<UserDocument> {
    const user = await this.usersRepository.update(id, {
      isSuspended: suspend,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.logger.info(`User ${suspend ? 'suspended' : 'unsuspended'}`, {
      userId: id,
    });
    return user;
  }

  async uploadVerificationDocument(
    id: string,
    url: string,
    publicId: string,
  ): Promise<UserDocument> {
    const user = await this.usersRepository.update(id, {
      verificationDocument: url,
      verificationDocPublicId: publicId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.logger.info('Verification document uploaded', { userId: id });
    return user;
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    totalAgents: number;
    verifiedAgents: number;
    pendingVerifications: number;
  }> {
    const [totalUsers, totalAgents, verifiedAgents, pendingVerifications] =
      await Promise.all([
        this.usersRepository.count(),
        this.usersRepository.count({ role: 'agent' }),
        this.usersRepository.count({ role: 'agent', isVerified: true }),
        this.usersRepository.count({ role: 'agent', isVerified: false }),
      ]);
    return { totalUsers, totalAgents, verifiedAgents, pendingVerifications };
  }
}
