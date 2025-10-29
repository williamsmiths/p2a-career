import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global Exception Filter
 * Xử lý tất cả exceptions và format response theo chuẩn
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errors: any = null;
    let code: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any;
        // Prefer provided code and errors if available
        code = resp.code || code;
        errors = resp.errors || resp.error || null;

        // Handle class-validator style messages array
        if (Array.isArray(resp.message)) {
          errors = resp.message;
        }
      }
    } else if (exception instanceof Error) {
      // Log unexpected server errors
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
      code = code || 'INTERNAL_SERVER_ERROR';
    }

    // Derive code from status if not explicitly provided
    if (!code) {
      const statusName = (HttpStatus as any)[status] as string | undefined;
      if (Array.isArray(errors)) {
        code = 'VALIDATION_ERROR';
      } else if (statusName) {
        code = statusName;
      } else {
        code = 'ERROR';
      }
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      code,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Structured logging by severity
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status}`,
        JSON.stringify(errorResponse),
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${status}`);
    }

    response.status(status).json(errorResponse);
  }
}

