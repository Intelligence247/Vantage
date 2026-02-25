import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().optional(),
  role: z.nativeEnum(Role).optional().default(Role.USER),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  name!: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  email!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Minimum 8 chars, 1 uppercase, 1 number',
  })
  password!: string;

  @ApiPropertyOptional({ example: '+234 800 000 0000' })
  phone?: string;

  @ApiPropertyOptional({ enum: Role, default: Role.USER })
  role?: Role;
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiProperty({ example: 'Password123' })
  password!: string;
}

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  refreshToken!: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
  };
  tokens: AuthTokens;
}
