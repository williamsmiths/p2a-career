import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, MaxLength, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'

export class CvExperienceDto {
  @IsString()
  @MaxLength(255)
  companyName: string

  @IsString()
  @MaxLength(255)
  position: string

  @IsDateString()
  startDate: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsString()
  description: string
}

export class CvProjectDto {
  @IsString()
  @MaxLength(255)
  projectName: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  projectUrl?: string

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string
}

export class CvCertificationDto {
  @IsString()
  @MaxLength(255)
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  issuedBy?: string

  @IsOptional()
  @IsDateString()
  issueDate?: string

  @IsOptional()
  @IsString()
  credentialUrl?: string
}

export class CreateCvDto {
  @IsString()
  @MaxLength(255)
  title: string

  @IsOptional()
  @IsString()
  careerObjective?: string

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvExperienceDto)
  experiences?: CvExperienceDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvProjectDto)
  projects?: CvProjectDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvCertificationDto)
  certifications?: CvCertificationDto[]
}
