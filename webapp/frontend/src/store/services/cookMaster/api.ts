import { createApi } from "@reduxjs/toolkit/query/react";

import { finalBaseQuery } from "./baseQuery";
import { userEndpoints } from "./user/endpoints";
import { eventEndpoints } from "./event/endpoints";
import { contractorEndpoints } from "./contractor/endpoints";
import { billingEndpoints } from "./billing/endpoints";
import { lessonEndpoints } from "./lesson/endpoints";
import { courseEndpoints } from "./course/endpoints";
import { clientEndpoints } from "./client/endpoints";
import { chatEndpoints } from "./chat/endpoints";
import { premiseEndpoints } from "./premise/endpoints";
import { roomEndpoints } from "./room/endpoints";

export const apiName = "cookMaster";
export const tagTypes = [
  "User",
  "Event",
  "Contractor",
  "Lesson",
  "Course",
  "Client",
  "Chat",
  "Premise",
  "Room",
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
    ...chatEndpoints(builder),
    ...premiseEndpoints(builder),
    ...roomEndpoints(builder),
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
  useGetMyMessagesWithMutation,
  useGetMyConversationsQuery,
  usePrefetch,
  usePatchMeMutation,
  useAddWorkshopToCourseMutation,
  useGetWorkshopsOfCourseQuery,
  useDeleteEventMutation,
  useGetMyProgressInCourseQuery,
  useGetLessonOfCourseAtIndexQuery,
  useRequestNextCourseAccessMutation,
  useCreatePremiseMutation,
  useDeletePremiseMutation,
  useDeleteRoomByIdMutation,
  useGetAllPremisesQuery,
  useGetPremiseByIdQuery,
  useGetRoomByIdQuery,
  useGetRoomsOfPremiseQuery,
  usePatchRoomByIdMutation,
  usePatchPremiseMutation,
  useCreateRoomInPremiseMutation,
  useGetClientByIdQuery,
} = api;
