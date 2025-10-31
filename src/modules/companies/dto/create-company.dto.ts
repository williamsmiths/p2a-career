import { IsString, IsOptional, IsEnum, IsInt, IsArray, MaxLength } from 'class-validator'
import { CompanyType } from '@common'

export class CreateCompanyDto {
  @IsString()
  @MaxLength(255)
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxId?: string

  @IsOptional()
  @IsEnum(CompanyType)
  companyType?: CompanyType

  @IsOptional()
  @IsInt()
  companySizeId?: number

  @IsOptional()
  @IsString()
  website?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  contactEmail?: string

  @IsOptional()
  @IsString()
  contactPhone?: string

  @IsOptional()
  @IsInt()
  cityId?: number

  @IsOptional()
  @IsString()
  streetAddress?: string

  @IsOptional()
  @IsString()
  logoUrl?: string

  @IsOptional()
  @IsString()
  bannerUrl?: string

  @IsOptional()
  @IsString()
  workingDays?: string

  @IsOptional()
  @IsString()
  overtimePolicy?: string

  @IsOptional()
  @IsArray()
  companyCulturePhotos?: string[]

  @IsOptional()
  @IsString()
  whyYouLoveWorkingHere?: string
}
