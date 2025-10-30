import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

/**
 * Health Check Controller
 */
@Controller('health')
export class HealthController {
  @Get()
  check(@Req() req: Request) {
    return {
      status: 'ok',
      service: 'p2a-career',
      timestamp: new Date().toISOString(),
      user: req.user ?? null,
    };
  }
}

