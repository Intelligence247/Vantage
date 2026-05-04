import { z } from 'zod';

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const initializePaymentParamSchema = z.object({
  propertyId: z.string().regex(objectIdRegex, 'Invalid property id'),
});

export type InitializePaymentParamInput = z.infer<
  typeof initializePaymentParamSchema
>;

export const verifyPaymentParamSchema = z.object({
  reference: z.string().min(6, 'Invalid payment reference'),
});

export type VerifyPaymentParamInput = z.infer<typeof verifyPaymentParamSchema>;
