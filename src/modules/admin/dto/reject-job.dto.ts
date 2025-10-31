import { IsString, IsNotEmpty } from 'class-validator'

export class RejectJobDto {
  @IsString()
  @IsNotEmpty()
  rejectionReason: string
}
