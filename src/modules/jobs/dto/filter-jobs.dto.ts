import { IsOptional, IsEnum, IsInt, IsBoolean, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { JobType, JobStatus } from '../../../common/enums';

export class FilterJobsDto {
  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm (title, description)' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ enum: JobType, description: 'Loại hình công việc' })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @ApiPropertyOptional({ enum: JobStatus, description: 'Trạng thái công việc' })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @ApiPropertyOptional({ description: 'ID thành phố' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  cityId?: number;

  @ApiPropertyOptional({ description: 'Chỉ lấy công việc remote' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isRemote?: boolean;

  @ApiPropertyOptional({ description: 'Chỉ lấy công việc tuyển gấp' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isUrgent?: boolean;

  @ApiPropertyOptional({ description: 'ID công ty' })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Trang', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng mỗi trang', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}

