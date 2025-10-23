import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators';

/**
 * Health Check Controller
 */
@Controller('health')
export class HealthController {
  @Get()
  @Public()
  check() {
    return {
      status: 'ok',
      service: 'p2a-career',
      timestamp: new Date().toISOString(),
    };
  }
}

