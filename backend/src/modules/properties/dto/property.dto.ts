import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PropertyType,
  PropertyCategory,
  PropertyKind,
  PropertyStatus,
} from '../schema/property.schema';

export { PropertyType, PropertyCategory, PropertyKind, PropertyStatus };

export const createPropertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000),
  price: z.number().positive('Price must be positive'),
  address: z.string().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  state: z.string().optional(),
  type: z.nativeEnum(PropertyType),
  category: z.nativeEnum(PropertyCategory).optional(),
  propertyKind: z.nativeEnum(PropertyKind).optional(),
  features: z.array(z.string()).optional().default([]),
  is360: z.boolean().optional().default(false),
  beds: z.number().int().min(0).optional(),
  baths: z.number().int().min(0).optional(),
  sqft: z.number().min(0).optional(),
  parking: z.number().int().min(0).optional(),
  yearBuilt: z.number().int().min(1800).max(2030).optional(),
  paymentPeriod: z.string().optional(),
  location: z
    .object({
      type: z.literal('Point').optional().default('Point'),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  nearbyPlaces: z
    .array(
      z.object({
        name: z.string(),
        distance: z.string(),
      }),
    )
    .optional()
    .default([]),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

export class CreatePropertyDto {
  @ApiProperty({ example: 'Luxury 5 Bedroom Duplex' })
  title!: string;

  @ApiProperty({ example: 'Beautiful duplex with modern finishes...' })
  description!: string;

  @ApiProperty({ example: 150000000 })
  price!: number;

  @ApiPropertyOptional({ example: '25 Banana Island Road' })
  address?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  city?: string;

  @ApiPropertyOptional({ example: 'Banana Island' })
  area?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  state?: string;

  @ApiProperty({ enum: PropertyType, example: PropertyType.SALE })
  type!: PropertyType;

  @ApiPropertyOptional({ enum: PropertyCategory })
  category?: PropertyCategory;

  @ApiPropertyOptional({ enum: PropertyKind })
  propertyKind?: PropertyKind;

  @ApiPropertyOptional({ example: ['Swimming Pool', 'Smart Home'] })
  features?: string[];

  @ApiPropertyOptional({ example: false })
  is360?: boolean;

  @ApiPropertyOptional({ example: 5 })
  beds?: number;

  @ApiPropertyOptional({ example: 6 })
  baths?: number;

  @ApiPropertyOptional({ example: 5000 })
  sqft?: number;

  @ApiPropertyOptional({ example: 3 })
  parking?: number;

  @ApiPropertyOptional({ example: 2022 })
  yearBuilt?: number;

  @ApiPropertyOptional({ example: 'yearly' })
  paymentPeriod?: string;
}

export const updatePropertySchema = createPropertySchema.partial();

export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export class UpdatePropertyDto extends CreatePropertyDto {}

export const propertyQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  search: z.string().optional(),
  type: z.nativeEnum(PropertyType).optional(),
  category: z.nativeEnum(PropertyCategory).optional(),
  propertyKind: z.nativeEnum(PropertyKind).optional(),
  status: z.nativeEnum(PropertyStatus).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  beds: z.string().optional(),
  baths: z.string().optional(),
  sort: z.string().optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PropertyQueryInput = z.infer<typeof propertyQuerySchema>;
