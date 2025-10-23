import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ description: 'ID công việc' })
  @IsString()
  @IsUUID()
  jobId: string;

  @ApiProperty({ description: 'ID CV sử dụng để ứng tuyển' })
  @IsString()
  @IsUUID()
  cvId: string;
}

