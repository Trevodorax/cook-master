import { IsOptional, IsString } from 'class-validator';

export class SearchCourseDto {
  @IsOptional()
  @IsString()
  searchTerm?: string;
}
