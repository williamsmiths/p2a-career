import { registerAs } from '@nestjs/config';

/**
 * Application Configuration
 */
export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  name: process.env.APP_NAME || 'P2A Career Module',
  url: process.env.APP_URL || 'http://localhost:3001',
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  timezone: 'UTC', // Luôn sử dụng UTC
}));

