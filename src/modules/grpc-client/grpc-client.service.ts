import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc, Client, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';

// gRPC User Service Interface
interface UserServiceGrpc {
  findById(data: { id: string }): any;
  findByEmail(data: { email: string }): any;
  validateUser(data: { id: string }): any;
  getUsersByIds(data: { ids: string[] }): any;
}

/**
 * gRPC Client Service
 * Giao tiếp với Core System qua gRPC
 */
@Injectable()
export class GrpcClientService implements OnModuleInit {
  private readonly logger = new Logger(GrpcClientService.name);
  private userService: UserServiceGrpc;

  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '../../../proto/user.proto'),
      url: 'localhost:50051', // Default URL
    },
  })
  private client: ClientGrpc;

  constructor(private configService: ConfigService) {
    // gRPC URL sẽ được set trong onModuleInit
  }

  onModuleInit() {
    this.userService = this.client.getService<UserServiceGrpc>('UserService');
    this.logger.log('gRPC Client initialized');
  }

  /**
   * Tìm user theo ID
   */
  async findUserById(id: string) {
    try {
      return await firstValueFrom(this.userService.findById({ id }));
    } catch (error) {
      this.logger.error(`Error finding user by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tìm user theo email
   */
  async findUserByEmail(email: string) {
    try {
      return await firstValueFrom(this.userService.findByEmail({ email }));
    } catch (error) {
      this.logger.error(`Error finding user by email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Validate user
   */
  async validateUser(id: string) {
    try {
      return await firstValueFrom(this.userService.validateUser({ id }));
    } catch (error) {
      this.logger.error(`Error validating user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Lấy nhiều users theo IDs
   */
  async getUsersByIds(ids: string[]) {
    try {
      const result = await firstValueFrom(this.userService.getUsersByIds({ ids })) as any;
      return result.users || [];
    } catch (error) {
      this.logger.error(`Error getting users by IDs:`, error);
      throw error;
    }
  }
}

