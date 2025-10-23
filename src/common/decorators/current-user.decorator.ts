import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator để lấy thông tin user hiện tại từ request
 * Sử dụng sau khi JWT Guard đã validate
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

