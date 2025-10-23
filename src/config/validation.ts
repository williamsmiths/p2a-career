import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync, IsOptional } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV?: Environment;

  @IsOptional()
  @IsNumber()
  PORT?: number;

  // Master Database
  @IsOptional()
  @IsString()
  DB_MASTER_HOST?: string;

  @IsOptional()
  @IsNumber()
  DB_MASTER_PORT?: number;

  @IsOptional()
  @IsString()
  DB_MASTER_USERNAME?: string;

  @IsOptional()
  @IsString()
  DB_MASTER_PASSWORD?: string;

  @IsOptional()
  @IsString()
  DB_MASTER_DATABASE?: string;

  // Slave Database
  @IsOptional()
  @IsString()
  DB_SLAVE_HOST?: string;

  @IsOptional()
  @IsNumber()
  DB_SLAVE_PORT?: number;

  @IsOptional()
  @IsString()
  DB_SLAVE_USERNAME?: string;

  @IsOptional()
  @IsString()
  DB_SLAVE_PASSWORD?: string;

  @IsOptional()
  @IsString()
  DB_SLAVE_DATABASE?: string;

  @IsOptional()
  @IsString()
  JWT_SECRET?: string;

  @IsOptional()
  @IsString()
  GRPC_CORE_SYSTEM_URL?: string;
}

export default function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: true });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

