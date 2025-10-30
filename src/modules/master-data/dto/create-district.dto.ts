import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nameEn?: string;

  @IsString()
  cityId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
