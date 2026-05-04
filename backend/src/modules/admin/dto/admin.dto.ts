import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const adminUserListQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  role: z.nativeEnum(Role).optional(),
});

export type AdminUserListQueryInput = z.infer<typeof adminUserListQuerySchema>;

export const adminPendingPropertiesQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});

export type AdminPendingPropertiesQueryInput = z.infer<
  typeof adminPendingPropertiesQuerySchema
>;

export const adminIdParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Invalid Mongo ObjectId'),
});

export type AdminIdParamInput = z.infer<typeof adminIdParamSchema>;

export const suspendUserSchema = z.object({
  suspend: z.boolean(),
});

export type SuspendUserInput = z.infer<typeof suspendUserSchema>;

export class SuspendUserDto {
  @ApiProperty({
    description: 'Set true to suspend user, false to unsuspend user',
    example: true,
  })
  suspend!: boolean;
}

export class AdminUsersQueryDto {
  @ApiPropertyOptional({ example: '1' })
  page?: string;

  @ApiPropertyOptional({ example: '20' })
  limit?: string;

  @ApiPropertyOptional({ enum: Role })
  role?: Role;
}
