import { IsOptional, IsEnum, IsInt, IsBoolean, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { JobType, JobStatus } from '@common'

export class FilterJobsDto {
  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  cityId?: number

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isRemote?: boolean

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isUrgent?: boolean

  @IsOptional()
  @IsString()
  companyId?: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  industryId?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  countryId?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10
}
