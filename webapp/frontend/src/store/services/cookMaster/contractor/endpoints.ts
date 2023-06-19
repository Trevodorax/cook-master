import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

import { Course, User } from "../types";
import { tagTypes } from "../api";

export const contractorEndpoints = (
  builder: EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    (typeof tagTypes)[number],
    string
  >
) => ({
  getUserFromContractor: builder.query<{ user: User }, number>({
    query: (id) => `contractors/${id}/user`,
    providesTags: (_, __, arg) => [{ type: "Contractor", id: arg }],
  }),
  getMyCoursesContractor: builder.query<Course[], void>({
    query: () => "contractors/me/courses",
    providesTags: ["Course"],
  }),
});
