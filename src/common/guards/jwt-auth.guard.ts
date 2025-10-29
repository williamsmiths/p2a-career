import { Injectable, ExecutionContext, UnauthorizedException, CanActivate, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';
import { GrpcClientService } from '../../modules/grpc-client/grpc-client.service';
import { ErrorCode } from '../errors/error-codes';

/**
 * JWT Authentication Guard
 * Tự động apply cho tất cả routes, trừ routes có @Public() decorator
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly grpcClient: GrpcClientService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'] || request.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Thiếu header Authorization dạng Bearer');
    }

    const token = authHeader.substring('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    try {
      const user = await this.grpcClient.validateToken(token);
      // Gắn user đã xác thực vào request để controller có thể dùng
      request.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.is_active,
        isEmailVerified: user.is_email_verified,
      };
      return true;
    } catch (e: any) {
      const rawMessage: string = typeof e?.message === 'string' ? e.message : '';
      // gRPC trả về message chính là mã lỗi từ RpcException
      const code = rawMessage === ErrorCode.AUTH_TOKEN_EXPIRED
        ? ErrorCode.AUTH_TOKEN_EXPIRED
        : ErrorCode.AUTH_TOKEN_INVALID;
      const message = code === ErrorCode.AUTH_TOKEN_EXPIRED
        ? 'Token đã hết hạn'
        : 'Token không hợp lệ';
      // Trả về HttpException với code cụ thể để HttpExceptionFilter giữ nguyên thay vì gán "UNAUTHORIZED"
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.UNAUTHORIZED,
          code,
          errors: message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

