import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

// Config
import { appConfig, databaseConfig, jwtConfig, grpcConfig, validate } from '@config'

// Common
import { JwtAuthGuard, RolesGuard } from './common/guards'
import { HttpExceptionFilter } from './common/filters'
import { TransformInterceptor } from './common/interceptors'

// Controllers
import { HealthController } from './health/health.controller'

// Modules
import { GrpcClientModule } from './modules/grpc-client/grpc-client.module'
import { CompaniesModule } from './modules/companies/companies.module'
import { JobsModule } from './modules/jobs/jobs.module'
import { CvsModule } from './modules/cvs/cvs.module'
import { ApplicationsModule } from './modules/applications/applications.module'
import { SavedJobsModule } from './modules/saved-jobs/saved-jobs.module'
import { MasterDataModule } from './modules/master-data/master-data.module'
import { AdminModule } from './modules/admin/admin.module'

@Module({
  imports: [
    // Config Module - Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, grpcConfig],
      validate,
      envFilePath: ['.env.local', '.env']
    }),

    // TypeORM Module - Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('database')
    }),

    // Bỏ Passport/JWT - xác thực qua gRPC Core System

    // Throttler Module - Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100 // 100 requests
      }
    ]),

    // Feature Modules
    GrpcClientModule,
    CompaniesModule,
    JobsModule,
    CvsModule,
    ApplicationsModule,
    SavedJobsModule,
    MasterDataModule,
    AdminModule
  ],
  controllers: [HealthController],
  providers: [
    // Global Guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },

    // Global Filters
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },

    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }
  ]
})
export class AppModule {}
