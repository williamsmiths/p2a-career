import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nameEn?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
