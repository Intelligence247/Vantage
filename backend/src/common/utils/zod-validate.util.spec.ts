import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { zodValidate } from './zod-validate.util';

describe('zodValidate', () => {
  const testSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    age: z.number().int().min(18).optional(),
  });

  it('should validate correct data', () => {
    const data = { name: 'John', email: 'john@example.com' };
    const result = zodValidate(testSchema, data);

    expect(result.name).toBe('John');
    expect(result.email).toBe('john@example.com');
  });

  it('should throw BadRequestException for invalid data', () => {
    const data = { name: 'J', email: 'not-an-email' };

    expect(() => zodValidate(testSchema, data)).toThrow(BadRequestException);
  });

  it('should include field-level error details', () => {
    const data = { name: 'J', email: 'not-an-email' };

    try {
      zodValidate(testSchema, data);
      fail('Expected BadRequestException');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const response = (error as BadRequestException).getResponse() as {
        errors: Array<{ field: string; message: string }>;
      };
      expect(response.errors).toBeDefined();
      expect(response.errors.length).toBeGreaterThan(0);
    }
  });

  it('should handle optional fields', () => {
    const data = { name: 'John', email: 'john@example.com', age: 25 };
    const result = zodValidate(testSchema, data);

    expect(result.age).toBe(25);
  });

  it('should reject invalid optional field values', () => {
    const data = { name: 'John', email: 'john@example.com', age: 10 };

    expect(() => zodValidate(testSchema, data)).toThrow(BadRequestException);
  });
});
