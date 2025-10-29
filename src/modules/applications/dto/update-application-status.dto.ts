import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '@common';

export class UpdateApplicationStatusDto {
  @ApiProperty({ enum: ApplicationStatus, description: 'Trạng thái mới' })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @ApiPropertyOptional({ description: 'Ghi chú của nhà tuyển dụng' })
  @IsOptional()
  @IsString()
  recruiterNotes?: string;
}

