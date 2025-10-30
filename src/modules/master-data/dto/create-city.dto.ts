import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nameEn?: string;

  @IsString()
  countryId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
