import { ZodSchema, ZodError } from 'zod';
import { BadRequestException } from '@nestjs/common';

export function zodValidate<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = formatZodErrors(result.error);
    throw new BadRequestException({
      message: 'Validation failed',
      errors,
    });
  }
  return result.data;
}

function formatZodErrors(
  error: ZodError,
): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: String(issue.path.join('.')),
    message: issue.message,
  }));
}
