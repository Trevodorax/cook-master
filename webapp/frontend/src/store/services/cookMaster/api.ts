import { createApi } from "@reduxjs/toolkit/query/react";

import { finalBaseQuery } from "./baseQuery";
import { userEndpoints } from "./user/endpoints";
import { eventEndpoints } from "./event/endpoints";
import { contractorEndpoints } from "./contractor/endpoints";
import { billingEndpoints } from "./billing/endpoints";
import { lessonEndpoints } from "./lesson/endpoints";
import { courseEndpoints } from "./course/endpoints";
import { clientEndpoints } from "./client/endpoints";

export const apiName = "cookMaster";
export const tagTypes = [
  "User",
  "Event",
  "Contractor",
  "Lesson",
  "Course",
  "Client",
] as const;

export const api = createApi({
  reducerPath: apiName,
  baseQuery: finalBaseQuery,
  tagTypes: tagTypes,
  endpoints: (builder) => ({
    ...userEndpoints(builder),
    ...eventEndpoints(builder),
    ...contractorEndpoints(builder),
    ...billingEndpoints(builder),
    ...lessonEndpoints(builder),
    ...courseEndpoints(builder),
    ...clientEndpoints(builder),
  }),
});

export const {
  useLoginMutation,
  useGetMeMutation,
  useCreateAccountMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  usePatchUserMutation,
  useConfirmAdminMutation,
  useGetAllEventsQuery,
  useGetMyEventsQuery,
  useCreateEventMutation,
  useGetEventByIdQuery,
  usePatchEventMutation,
  useGetUserFromContractorQuery,
  useCreateBillingIntentMutation,
  useGetAllCoursesQuery,
  useAddUserToEventMutation,
  useCreateCourseMutation,
  useCreateLessonMutation,
  useDeleteCourseMutation,
  useDeleteLessonMutation,
  useGetAllLessonsQuery,
  useGetClientsOfCourseQuery,
  useGetCourseByIdQuery,
  useGetCourseOfLessonQuery,
  useGetLessonByIdQuery,
  useGetLessonsOfCourseQuery,
  useGetClientsFromEventQuery,
  usePatchCourseMutation,
  usePatchLessonMutation,
  useGetMyCoursesContractorQuery,
  useGetMyEventsContractorQuery,
  useGetMyEventsClientQuery,
  useGetMyCoursesClientQuery,
  useApplyToEventMutation,
  useResignFromEventMutation,
  useGetUserFromClientQuery,
  useApplyToCourseMutation,
  useResignFromCourseMutation,
  usePrefetch,
} = api;
