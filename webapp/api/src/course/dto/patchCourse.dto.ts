import { IsOptional, IsString } from 'class-validator';

export class PatchCourseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
