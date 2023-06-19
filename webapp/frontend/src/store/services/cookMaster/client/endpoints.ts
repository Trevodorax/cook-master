import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

import { CookMasterEvent, Course } from "../types";
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
});
