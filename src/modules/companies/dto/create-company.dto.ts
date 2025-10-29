import { IsString, IsOptional, IsEnum, IsInt, IsArray, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyType } from '@common';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Tên công ty' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Mã số thuế' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxId?: string;

  @ApiPropertyOptional({ enum: CompanyType, description: 'Loại hình công ty' })
  @IsOptional()
  @IsEnum(CompanyType)
  companyType?: CompanyType;

  @ApiPropertyOptional({ description: 'ID quy mô công ty' })
  @IsOptional()
  @IsInt()
  companySizeId?: number;

  @ApiPropertyOptional({ description: 'Website công ty' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Mô tả công ty' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Email liên hệ' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại liên hệ' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'ID thành phố' })
  @IsOptional()
  @IsInt()
  cityId?: number;

  @ApiPropertyOptional({ description: 'Địa chỉ chi tiết' })
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @ApiPropertyOptional({ description: 'URL logo' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'URL banner' })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({ description: 'Ngày làm việc (VD: Thứ 2 - Thứ 6)' })
  @IsOptional()
  @IsString()
  workingDays?: string;

  @ApiPropertyOptional({ description: 'Chính sách OT' })
  @IsOptional()
  @IsString()
  overtimePolicy?: string;

  @ApiPropertyOptional({ description: 'Ảnh văn hóa công ty', type: [String] })
  @IsOptional()
  @IsArray()
  companyCulturePhotos?: string[];

  @ApiPropertyOptional({ description: 'Lý do nên làm việc tại đây' })
  @IsOptional()
  @IsString()
  whyYouLoveWorkingHere?: string;
}

