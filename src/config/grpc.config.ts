import { registerAs } from '@nestjs/config';

/**
 * gRPC Configuration
 * Kết nối với Core System qua gRPC
 */
export default registerAs('grpc', () => ({
  coreSystemUrl: process.env.GRPC_CORE_SYSTEM_URL || 'localhost:50051',
}));

