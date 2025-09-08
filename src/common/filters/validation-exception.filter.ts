import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Validation Exception Filter
 * This filter provides custom formatting for validation errors
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | object;
    let errors: any[] = [];

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || 'Validation failed';
      
      // Extract validation errors if they exist
      if (Array.isArray(responseObj.message)) {
        errors = responseObj.message.map((error: string) => ({
          field: this.extractFieldFromError(error),
          message: error,
        }));
      }
    } else {
      message = exceptionResponse as string;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: 'Validation Error',
      message,
      ...(errors.length > 0 && { errors }),
    };

    response.status(status).json(errorResponse);
  }

  private extractFieldFromError(error: string): string {
    // Simple field extraction from validation error messages
    const match = error.match(/^(\w+)\s/);
    return match ? match[1] : 'unknown';
  }
}
