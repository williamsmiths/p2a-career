import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom Exception: Not Found
 */
export class NotFoundException extends HttpException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} với ID '${identifier}' không tồn tại`
      : `${resource} không tồn tại`;
    super(message, HttpStatus.NOT_FOUND);
  }
}

/**
 * Custom Exception: Unauthorized
 */
export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Không có quyền truy cập') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

/**
 * Custom Exception: Forbidden
 */
export class ForbiddenException extends HttpException {
  constructor(message: string = 'Bạn không có quyền thực hiện hành động này') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

/**
 * Custom Exception: Validation Error
 */
export class ValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * Custom Exception: Conflict (Duplicate)
 */
export class ConflictException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

/**
 * Custom Exception: Business Logic Error
 */
export class BusinessException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, statusCode);
  }
}

