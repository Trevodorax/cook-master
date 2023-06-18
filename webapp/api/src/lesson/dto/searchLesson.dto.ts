import { IsOptional, IsString } from 'class-validator';

export class SearchLessonDto {
  @IsOptional()
  @IsString()
  searchTerm?: string;
}
