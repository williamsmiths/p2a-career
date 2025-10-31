import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApplicationStatus } from '@common'

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus

  @IsOptional()
  @IsString()
  recruiterNotes?: string
}
