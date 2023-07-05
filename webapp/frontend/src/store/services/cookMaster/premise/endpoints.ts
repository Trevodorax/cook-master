import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

import { tagTypes } from "../api";
import { CreateAddressDto, GetPremiseDto, PatchPremiseDto } from "./dto";
import { Premise, Room } from "../types";

export const premiseEndpoints = (
  builder: EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    (typeof tagTypes)[number],
    string
  >
) => ({
  getAllPremises: builder.query<Premise[], void>({
    query: () => "premises",
    providesTags: ["Premise"],
  }),
  createPremise: builder.mutation<Premise, CreateAddressDto>({
    query: (newPremiseData) => ({
      url: "premises",
      method: "POST",
      body: newPremiseData,
    }),
    invalidatesTags: ["Premise"],
  }),
  getPremiseById: builder.query<Premise, GetPremiseDto>({
    query: ({ premiseId }) => `premises/${premiseId}`,
    providesTags: (_, __, arg) => [{ type: "Premise", id: arg.premiseId }],
  }),
  patchPremise: builder.mutation<
    Premise,
    { dto: GetPremiseDto; patchPremiseDto: PatchPremiseDto }
  >({
    query: ({ dto, patchPremiseDto }) => ({
      url: `premises/${dto.premiseId}`,
      method: "PATCH",
      body: patchPremiseDto,
    }),
    invalidatesTags: (_, __, arg) => [
      { type: "Premise", id: arg.dto.premiseId },
    ],
  }),
  getRoomsOfPremise: builder.query<Room[], GetPremiseDto>({
    query: ({ premiseId }) => `premises/${premiseId}/rooms`,
    providesTags: (_, __, arg) => [{ type: "Premise", id: arg.premiseId }],
  }),
  deletePremise: builder.mutation<void, GetPremiseDto>({
    query: ({ premiseId }) => ({
      url: `premises/${premiseId}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Premise"],
  }),
  createRoomInPremise: builder.mutation<
    Room,
    { premiseId: number; capacity: number }
  >({
    query: ({ premiseId, capacity }) => ({
      url: `premises/${premiseId}/rooms`,
      method: "POST",
      body: {
        capacity,
      },
    }),
    invalidatesTags: ["Premise"],
  }),
});
