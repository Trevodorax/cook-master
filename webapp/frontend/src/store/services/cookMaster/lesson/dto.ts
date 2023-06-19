export interface CreateLessonDto {
  name: string;
  description: string;
  content: string;
  courseId: number;
}

export interface GetLessonDto {
  lessonId: number;
}

export interface PatchLessonDto {
  name?: string;
  description?: string;
  content?: string;
}

export interface SearchLessonDto {
  searchTerm?: string;
}
