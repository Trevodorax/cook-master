import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

import { tagTypes } from "../api";
import {
  CreateCourseDto,
  GetCourseDto,
  PatchCourseDto,
  SearchCourseDto,
} from "./dto";
import { Client, Course, Lesson, serializedCookMasterEvent } from "../types";
import { buildQueryParams } from "../../utils/buildQueryParams";
import { CreateEventDto } from "../event/dto";

export const courseEndpoints = (
  builder: EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    (typeof tagTypes)[number],
    string
  >
) => ({
  getAllCourses: builder.query<
    Course[],
    { filters: { day?: string; term?: string } }
  >({
    query: ({ filters }) => {
      const queryParams = buildQueryParams(filters);

      return "courses" + queryParams;
    },
    providesTags: ["Course"],
  }),
  createCourse: builder.mutation<Course, CreateCourseDto>({
    query: (newCourseData) => ({
      url: "courses",
      method: "POST",
      body: newCourseData,
    }),
    invalidatesTags: ["Course"],
  }),
  searchCourses: builder.query<Course[], SearchCourseDto>({
    query: ({ searchTerm }) => `courses/search?searchTerm=${searchTerm}`,
    providesTags: ["Course"],
  }),
  getCourseById: builder.query<Course, GetCourseDto>({
    query: ({ courseId }) => `courses/${courseId}`,
    providesTags: (_, __, arg) => [{ type: "Course", id: arg.courseId }],
  }),
  patchCourse: builder.mutation<
    Course,
    { dto: GetCourseDto; patchCourseDto: PatchCourseDto }
  >({
    query: ({ dto, patchCourseDto }) => ({
      url: `courses/${dto.courseId}`,
      method: "PATCH",
      body: patchCourseDto,
    }),
    invalidatesTags: (_, __, arg) => [{ type: "Course", id: arg.dto.courseId }],
  }),
  getLessonsOfCourse: builder.query<Lesson[], GetCourseDto>({
    query: ({ courseId }) => `courses/${courseId}/lessons`,
    providesTags: (_, __, arg) => [{ type: "Course", id: arg.courseId }],
  }),
  getWorkshopsOfCourse: builder.query<
    serializedCookMasterEvent[],
    GetCourseDto
  >({
    query: ({ courseId }) => `courses/${courseId}/workshops`,
    providesTags: ["Event"],
  }),
  addWorkshopToCourse: builder.mutation<
    serializedCookMasterEvent,
    { courseId: number; workshop: CreateEventDto }
  >({
    query: ({ courseId, workshop }) => ({
      url: `courses/${courseId}/workshops`,
      method: "POST",
      body: workshop,
    }),
    invalidatesTags: (_, __, arg) => [{ type: "Course", id: arg.courseId }],
  }),
  getClientsOfCourse: builder.query<Client[], GetCourseDto>({
    // Note: the Client type isn't defined here, replace this with the correct Client type
    query: ({ courseId }) => `courses/${courseId}/clients`,
    providesTags: (_, __, arg) => [{ type: "Course", id: arg.courseId }],
  }),
  deleteCourse: builder.mutation<void, GetCourseDto>({
    query: ({ courseId }) => ({
      url: `courses/${courseId}`,
      method: "DELETE",
    }),
    invalidatesTags: (_, __, arg) => [{ type: "Course", id: arg.courseId }],
  }),
});
