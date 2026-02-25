import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface ErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
  errors?: unknown;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';
    let errors: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as ErrorResponse;
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message || exception.message;
      error = exception.name;
      errors =
        typeof exceptionResponse === 'object' ? exceptionResponse.errors : undefined;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    const logPayload = {
      status,
      error,
      message,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      ...(status >= 500 && { stack: exception instanceof Error ? exception.stack : undefined }),
    };

    if (status >= 500) {
      this.logger.error('Server error', logPayload);
    } else {
      this.logger.warn('Client error', logPayload);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      message,
      ...(errors !== undefined && { errors }),
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
