import { IsNotEmpty } from 'class-validator';

export class GetLessonDto {
  @IsNotEmpty()
  lessonId: string;
}
