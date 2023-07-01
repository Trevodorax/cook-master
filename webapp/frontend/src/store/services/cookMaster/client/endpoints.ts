import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

import { CookMasterEvent, Course, User } from "../types";
import { tagTypes } from "../api";

export const clientEndpoints = (
  builder: EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    (typeof tagTypes)[number],
    string
  >
) => ({
  getMyCoursesClient: builder.query<Course[], void>({
    query: () => "clients/me/courses",
    providesTags: ["Course"],
  }),
  getMyEventsClient: builder.query<CookMasterEvent[], void>({
    query: () => "clients/me/events",
    providesTags: ["Event"],
  }),
  applyToEvent: builder.mutation<void, { eventId: number }>({
    query: ({ eventId }) => ({
      url: "clients/me/events",
      method: "POST",
      body: { eventId },
    }),
    invalidatesTags: ["Event"],
  }),
  resignFromEvent: builder.mutation<void, { eventId: number }>({
    query: ({ eventId }) => ({
      url: "clients/me/events",
      method: "DELETE",
      body: { eventId },
    }),
    invalidatesTags: ["Event"],
  }),
  applyToCourse: builder.mutation<void, { courseId: number }>({
    query: ({ courseId }) => ({
      url: "clients/me/courses",
      method: "POST",
      body: { courseId },
    }),
    invalidatesTags: ["Course"],
  }),
  resignFromCourse: builder.mutation<void, { courseId: number }>({
    query: ({ courseId }) => ({
      url: "clients/me/courses",
      method: "DELETE",
      body: { courseId },
    }),
    invalidatesTags: ["Course"],
  }),
  getUserFromClient: builder.query<{ user: User }, number>({
    query: (id) => `clients/${id}/user`,
    providesTags: (_, __, arg) => [{ type: "Client", id: arg }],
  }),
  getMyProgressInCourse: builder.query<number, number>({
    query: (courseId) => `clients/me/courses/${courseId}/progress`,
  }),
});
