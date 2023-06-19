export interface CreateCourseDto {
  name: string;
  description: string;
  contractorId: number;
}

export interface GetCourseDto {
  courseId: number;
}

export interface PatchCourseDto {
  name?: string;
  description?: string;
}

export interface SearchCourseDto {
  searchTerm?: string;
}
