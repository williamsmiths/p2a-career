import { IsOptional, IsString } from 'class-validator'

export class ApproveJobDto {
  @IsOptional()
  @IsString()
  note?: string
}
