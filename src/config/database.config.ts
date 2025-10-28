import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Database Configuration - PostgreSQL với Master/Slave Replication
 */
export default registerAs('database', (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production', // Tự động sync schema
    // Bảo đảm TypeORM tự tạo extension phục vụ UUID khi sync schema
    uuidExtension: 'pgcrypto',
    logging: process.env.NODE_ENV === 'development',
    extra: {
      timezone: 'UTC',
    },
    // Master/Slave Replication Configuration
    replication: {
      master: {
        host: process.env.DB_MASTER_HOST || 'localhost',
        port: parseInt(process.env.DB_MASTER_PORT || '5534', 10),
        username: process.env.DB_MASTER_USERNAME || 'p2a_career_user',
        password: process.env.DB_MASTER_PASSWORD || 'P2aCareer!2025',
        database: process.env.DB_MASTER_DATABASE || 'p2a_career',
      },
      slaves: [
        {
          host: process.env.DB_SLAVE_HOST || 'localhost',
          port: parseInt(process.env.DB_SLAVE_PORT || '5535', 10),
          username: process.env.DB_SLAVE_USERNAME || 'p2a_career_user',
          password: process.env.DB_SLAVE_PASSWORD || 'P2aCareer!2025',
          database: process.env.DB_SLAVE_DATABASE || 'p2a_career',
        },
      ],
    },
  };
});

