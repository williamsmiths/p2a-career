import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, IsDateString, MaxLength } from 'class-validator'
import { JobType } from '@common'

export class CreateJobDto {
  @IsString()
  @MaxLength(255)
  title: string

  @IsString()
  description: string

  @IsString()
  requirements: string

  @IsString()
  benefits: string

  @IsOptional()
  @IsInt()
  salaryMin?: number

  @IsOptional()
  @IsInt()
  salaryMax?: number

  @IsEnum(JobType)
  jobType: JobType

  @IsOptional()
  @IsDateString()
  deadline?: string

  @IsOptional()
  @IsInt()
  cityId?: number

  @IsOptional()
  @IsInt()
  positionLevelId?: number

  @IsOptional()
  @IsInt()
  experienceLevelId?: number

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean

  // Internship specific fields
  @IsOptional()
  @IsInt()
  durationMonths?: number

  @IsOptional()
  @IsInt()
  allowanceMin?: number

  @IsOptional()
  @IsInt()
  allowanceMax?: number

  @IsOptional()
  @IsBoolean()
  mentorshipAvailable?: boolean

  @IsOptional()
  @IsString()
  learningObjectives?: string

  // Priority notification fields
  @IsOptional()
  @IsBoolean()
  notifyAlumni?: boolean

  @IsOptional()
  @IsString()
  prioritizeUniversityId?: string

  // Additional filters
  @IsOptional()
  @IsInt()
  industryId?: number

  @IsOptional()
  @IsInt()
  countryId?: number
}
