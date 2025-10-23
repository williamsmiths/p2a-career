import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobType } from '../../../common/enums';

export class CreateJobDto {
  @ApiProperty({ description: 'Tiêu đề công việc' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Mô tả công việc' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Yêu cầu công việc' })
  @IsString()
  requirements: string;

  @ApiProperty({ description: 'Quyền lợi' })
  @IsString()
  benefits: string;

  @ApiPropertyOptional({ description: 'Mức lương tối thiểu' })
  @IsOptional()
  @IsInt()
  salaryMin?: number;

  @ApiPropertyOptional({ description: 'Mức lương tối đa' })
  @IsOptional()
  @IsInt()
  salaryMax?: number;

  @ApiProperty({ enum: JobType, description: 'Loại hình công việc' })
  @IsEnum(JobType)
  jobType: JobType;

  @ApiPropertyOptional({ description: 'Hạn nộp hồ sơ', example: '2025-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ description: 'ID thành phố' })
  @IsOptional()
  @IsInt()
  cityId?: number;

  @ApiPropertyOptional({ description: 'ID cấp bậc' })
  @IsOptional()
  @IsInt()
  positionLevelId?: number;

  @ApiPropertyOptional({ description: 'ID kinh nghiệm yêu cầu' })
  @IsOptional()
  @IsInt()
  experienceLevelId?: number;

  @ApiPropertyOptional({ description: 'Cho phép làm việc từ xa' })
  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @ApiPropertyOptional({ description: 'Tuyển gấp' })
  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;
}

