import { createApi } from "@reduxjs/toolkit/query/react";

import { finalBaseQuery } from "./baseQuery";
import { userEndpoints } from "./user/endpoints";
import { eventEndpoints } from "./event/endpoints";
import { contractorEndpoints } from "./contractor/endpoints";
import { billingEndpoints } from "./billing/endpoints";

export const apiName = "cookMaster";
export const tagTypes = ["User", "Event", "Contractor"] as const;

export const api = createApi({
  reducerPath: apiName,
  baseQuery: finalBaseQuery,
  tagTypes: tagTypes,
  endpoints: (builder) => ({
    ...userEndpoints(builder),
    ...eventEndpoints(builder),
    ...contractorEndpoints(builder),
    ...billingEndpoints(builder),
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
} = api;
