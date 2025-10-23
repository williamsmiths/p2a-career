import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CvExperienceDto {
  @ApiProperty({ description: 'Tên công ty' })
  @IsString()
  @MaxLength(255)
  companyName: string;

  @ApiProperty({ description: 'Vị trí' })
  @IsString()
  @MaxLength(255)
  position: string;

  @ApiProperty({ description: 'Ngày bắt đầu', example: '2020-01-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ description: 'Ngày kết thúc (null nếu đang làm)', example: '2023-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Mô tả công việc' })
  @IsString()
  description: string;
}

export class CvProjectDto {
  @ApiProperty({ description: 'Tên dự án' })
  @IsString()
  @MaxLength(255)
  projectName: string;

  @ApiPropertyOptional({ description: 'Mô tả dự án' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'URL dự án' })
  @IsOptional()
  @IsString()
  projectUrl?: string;

  @ApiPropertyOptional({ description: 'Ngày bắt đầu', example: '2020-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Ngày kết thúc', example: '2023-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class CvCertificationDto {
  @ApiProperty({ description: 'Tên chứng chỉ' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Tổ chức cấp' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  issuedBy?: string;

  @ApiPropertyOptional({ description: 'Ngày cấp', example: '2023-01-01' })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({ description: 'URL chứng chỉ' })
  @IsOptional()
  @IsString()
  credentialUrl?: string;
}

export class CreateCvDto {
  @ApiProperty({ description: 'Tiêu đề CV' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Mục tiêu nghề nghiệp' })
  @IsOptional()
  @IsString()
  careerObjective?: string;

  @ApiPropertyOptional({ description: 'CV công khai', default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Kinh nghiệm làm việc', type: [CvExperienceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvExperienceDto)
  experiences?: CvExperienceDto[];

  @ApiPropertyOptional({ description: 'Dự án đã tham gia', type: [CvProjectDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvProjectDto)
  projects?: CvProjectDto[];

  @ApiPropertyOptional({ description: 'Chứng chỉ/Giải thưởng', type: [CvCertificationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvCertificationDto)
  certifications?: CvCertificationDto[];
}

