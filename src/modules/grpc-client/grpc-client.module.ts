import { Module, Global } from '@nestjs/common';
import { GrpcClientService } from './grpc-client.service';

/**
 * gRPC Client Module
 * Global module - có thể inject GrpcClientService ở bất kỳ đâu
 */
@Global()
@Module({
  providers: [GrpcClientService],
  exports: [GrpcClientService],
})
export class GrpcClientModule {}

