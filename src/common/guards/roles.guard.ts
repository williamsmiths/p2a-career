import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { UserRole } from '../enums';
import { ErrorCode } from '../errors/error-codes';

/**
 * Roles Guard
 * Kiểm tra xem user có role phù hợp không
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.FORBIDDEN,
          code: ErrorCode.FORBIDDEN,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.FORBIDDEN,
          code: ErrorCode.FORBIDDEN,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}

