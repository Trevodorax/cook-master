import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class PatchEventDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsInt()
  durationMin: number;

  @IsOptional()
  @IsInt()
  animator: number;
}
