import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePremiseDto {
  @IsString()
  @IsNotEmpty()
  streetName: string;

  @IsOptional()
  @IsString()
  streetNumber: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
