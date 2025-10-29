import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common';

export class BusinessException extends HttpException {
  constructor(code: ErrorCode, errors?: unknown) {
    super(
      {
        code,
        ...(errors ? { errors } : {}),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

