import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import {
  RegisterInput,
  LoginInput,
  AuthTokens,
  AuthResponse,
  VerifyEmailInput,
} from './dto/auth.dto';
import { JwtPayload } from '../../common/decorators';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const user = await this.usersService.create(input);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    
    await this.usersService.setEmailVerificationToken(user.id as string, otp, expiresAt);
    
    // dispatch email
    this.mailService.sendEmailVerification(user.email, user.name, otp).catch(e => {
        this.logger.error('Failed to send async email verification', e);
    });

    const tokens = await this.generateTokens({
      sub: user.id as string,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    await this.usersService.updateRefreshToken(
      user.id as string,
      tokens.refreshToken,
    );

    this.logger.info('User registered', {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id as string,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      tokens,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.isSuspended) {
      throw new UnauthorizedException(
        'Your account has been suspended. Contact support.',
      );
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens({
      sub: user.id as string,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    await this.usersService.updateRefreshToken(
      user.id as string,
      tokens.refreshToken,
    );

    this.logger.info('User logged in', {
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id as string,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      tokens,
    };
  }

  async verifyEmail(input: VerifyEmailInput): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(input.email);
    if (!user) {
      throw new BadRequestException('Invalid email or token');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    if (!user.emailVerificationToken || user.emailVerificationToken !== input.token) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.emailVerificationTokenExpires && user.emailVerificationTokenExpires < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.usersService.verifyEmail(user.id as string);

    this.logger.info('User email verified', {
      userId: user.id,
      email: user.email,
    });

    return { message: 'Email successfully verified' };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const user = await this.usersService.findById(userId);

    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const isTokenValid = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens({
      sub: user.id as string,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    await this.usersService.updateRefreshToken(
      user.id as string,
      tokens.refreshToken,
    );

    this.logger.info('Tokens refreshed', { userId: user.id });
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
    this.logger.info('User logged out', { userId });
  }

  private async generateTokens(payload: JwtPayload): Promise<AuthTokens> {
    const tokenPayload = { sub: payload.sub, email: payload.email, role: payload.role, isVerified: payload.isVerified };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(tokenPayload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get('jwt.accessExpiresIn') ?? '15m',
      } as any),
      this.jwtService.signAsync(tokenPayload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn') ?? '7d',
      } as any),
    ]);

    return { accessToken, refreshToken };
  }

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
        },
      );
      return payload;
    } catch {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
