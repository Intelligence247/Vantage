import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export const createUserSchema = z.object({
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

export type CreateUserInput = z.infer<typeof createUserSchema>;

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  email!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Minimum 8 chars, 1 uppercase, 1 number',
  })
  password!: string;

  @ApiPropertyOptional({
    example: '+234 800 000 0000',
    description: 'Phone number',
  })
  phone?: string;

  @ApiPropertyOptional({
    enum: Role,
    default: Role.USER,
    description: 'User role',
  })
  role?: Role;
}

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  avatarPublicId: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;

  @ApiPropertyOptional({ example: '+234 800 000 0000' })
  phone?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/...' })
  avatar?: string;
}

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword123' })
  currentPassword!: string;

  @ApiProperty({ example: 'NewPassword456' })
  newPassword!: string;
}

export const updateNotificationPrefsSchema = z.object({
  email: z.boolean().optional(),
  push: z.boolean().optional(),
  sms: z.boolean().optional(),
});

export type UpdateNotificationPrefsInput = z.infer<
  typeof updateNotificationPrefsSchema
>;

export class UpdateNotificationPrefsDto {
  @ApiPropertyOptional({ example: true })
  email?: boolean;

  @ApiPropertyOptional({ example: true })
  push?: boolean;

  @ApiPropertyOptional({ example: false })
  sms?: boolean;
}
