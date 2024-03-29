import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

import { tagTypes } from "../api";
import {
  CreateLessonDto,
  GetLessonDto,
  PatchLessonDto,
  SearchLessonDto,
} from "./dto";
import { Lesson } from "../types";

export const lessonEndpoints = (
  builder: EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    (typeof tagTypes)[number],
    string
  >
) => ({
  getAllLessons: builder.query<Array<Lesson>, void>({
    query: () => "lessons",
    providesTags: ["Lesson"],
  }),
  createLesson: builder.mutation<Lesson, CreateLessonDto>({
    query: (newLessonData) => ({
      url: "lessons",
      method: "POST",
      body: newLessonData,
    }),
    invalidatesTags: ["Lesson"],
  }),
  searchLessons: builder.query<Array<Lesson>, SearchLessonDto>({
    query: ({ searchTerm }) => `lessons/search?searchTerm=${searchTerm}`,
    providesTags: ["Lesson"],
  }),
  getLessonById: builder.query<Lesson, GetLessonDto>({
    query: ({ lessonId }) => `lessons/${lessonId}`,
    providesTags: (_, __, arg) => [{ type: "Lesson", id: arg.lessonId }],
  }),
  patchLesson: builder.mutation<
    void,
    { dto: GetLessonDto; patchLessonDto: PatchLessonDto }
  >({
    query: ({ dto, patchLessonDto }) => ({
      url: `lessons/${dto.lessonId}`,
      method: "PATCH",
      body: patchLessonDto,
    }),
    invalidatesTags: (_, __, arg) => [{ type: "Lesson", id: arg.dto.lessonId }],
  }),
  getCourseOfLesson: builder.query<any, GetLessonDto>({
    query: ({ lessonId }) => `lessons/${lessonId}/course`,
    providesTags: (_, __, arg) => [{ type: "Lesson", id: arg.lessonId }],
  }),
  deleteLesson: builder.mutation<Lesson, GetLessonDto>({
    query: ({ lessonId }) => ({
      url: `lessons/${lessonId}`,
      method: "DELETE",
    }),
    invalidatesTags: (_, __, arg) => [{ type: "Lesson", id: arg.lessonId }],
  }),
});
