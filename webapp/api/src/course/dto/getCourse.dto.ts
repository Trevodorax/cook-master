import { IsNotEmpty } from 'class-validator';

export class GetCourseDto {
  @IsNotEmpty()
  courseId: string;
}
