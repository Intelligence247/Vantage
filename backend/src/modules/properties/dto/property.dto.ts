import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PropertyType,
  PropertyCategory,
  PropertyKind,
  PropertyStatus,
} from '../schema/property.schema';

export { PropertyType, PropertyCategory, PropertyKind, PropertyStatus };

/** GeoJSON Point: coordinates are [longitude, latitude] (RFC 7946 / MongoDB 2dsphere). */
const geoPointSchema = z
  .object({
    type: z.literal('Point').optional(),
    coordinates: z.tuple([
      z.number().min(-180).max(180),
      z.number().min(-90).max(90),
    ]),
  })
  .transform((data) => ({
    type: 'Point' as const,
    coordinates: data.coordinates,
  }));

const createPropertyBaseSchema = z.object({
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
  /** GeoJSON Point — prefer sending `latitude` + `longitude` from the browser unless you already use GeoJSON. */
  location: geoPointSchema.optional(),
  /** WGS-84 latitude; must be sent together with `longitude` (exclusive with `location`). */
  latitude: z.number().min(-90).max(90).optional(),
  /** WGS-84 longitude; must be sent together with `latitude` (exclusive with `location`). */
  longitude: z.number().min(-180).max(180).optional(),
  nearbyPlaces: z
    .array(
      z.object({
        name: z.string(),
        distance: z.string(),
      }),
    )
    .optional()
    .default([]),
  images: z
    .array(
      z.object({
        url: z.string(),
        publicId: z.string(),
      }),
    )
    .optional()
    .default([]),
});

function refineLocationExclusivity(
  data: {
    location?: { type: string; coordinates: [number, number] };
    latitude?: number;
    longitude?: number;
  },
  ctx: z.RefinementCtx,
): void {
  const hasLocation =
    data.location != null &&
    Array.isArray(data.location.coordinates) &&
    data.location.coordinates.length === 2;
  const hasLat = data.latitude !== undefined;
  const hasLng = data.longitude !== undefined;

  if (hasLat !== hasLng) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'Provide both latitude and longitude (WGS-84), or use location (GeoJSON Point with [lng, lat]).',
      path: hasLat ? ['longitude'] : ['latitude'],
    });
  }
  if (hasLocation && (hasLat || hasLng)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'Use either location (GeoJSON) or latitude/longitude, not both.',
      path: ['location'],
    });
  }
}

export const createPropertySchema = createPropertyBaseSchema.superRefine(
  refineLocationExclusivity,
);

export const updatePropertySchema = createPropertyBaseSchema
  .partial()
  .extend({
    /** When true (and no new latitude/longitude/location is sent), removes stored map coordinates. */
    clearMapLocation: z.boolean().optional(),
  })
  .superRefine(refineLocationExclusivity);

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

  @ApiPropertyOptional({
    description:
      'GeoJSON Point. coordinates: [longitude, latitude]. Omit if using latitude/longitude instead.',
    example: { type: 'Point', coordinates: [3.3792, 6.5244] },
  })
  location?: { type: 'Point'; coordinates: [number, number] };

  @ApiPropertyOptional({
    description:
      'WGS-84 latitude (e.g. from navigator.geolocation). Send together with longitude; do not send `location` at the same time.',
    example: 6.5244,
  })
  latitude?: number;

  @ApiPropertyOptional({
    description:
      'WGS-84 longitude. Send together with latitude; do not send `location` at the same time.',
    example: 3.3792,
  })
  longitude?: number;

  @ApiPropertyOptional({
    type: [Object],
    example: [{ url: 'https://res.cloudinary.com/...', publicId: 'abc123_xyz' }],
  })
  images?: { url: string; publicId: string }[];
}

export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export class UpdatePropertyDto extends CreatePropertyDto {
  @ApiPropertyOptional({
    description:
      'When true and the body does not include latitude, longitude, or location, removes the stored map pin.',
  })
  clearMapLocation?: boolean;
}

export const propertyQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  search: z.string().optional(),
  agent: z.string().optional(),
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
