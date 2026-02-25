import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const createInquirySchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;

export class CreateInquiryDto {
  @ApiProperty({ example: '60d5ecb54b24a0342c8d9f1a' })
  propertyId!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: '+234 800 000 0000' })
  phone?: string;

  @ApiProperty({ example: 'I am interested in this property...' })
  message!: string;
}

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.enum(['general', 'listing', 'agent', 'support', 'partnership']),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export class ContactFormDto {
  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: '+234 800 000 0000' })
  phone?: string;

  @ApiProperty({
    enum: ['general', 'listing', 'agent', 'support', 'partnership'],
  })
  subject!: string;

  @ApiProperty({ example: 'I have a question about...' })
  message!: string;
}
