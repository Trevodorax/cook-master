import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { tagTypes } from "../api";
import { Room, SerializedCookMasterEvent } from "../types";

export const roomEndpoints = (
  builder: EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    (typeof tagTypes)[number],
    string
  >
) => ({
  getRoomById: builder.query<Room, number>({
    query: (roomId) => `rooms/${roomId}`,
    providesTags: (_, __, roomId) => [{ type: "Room", id: roomId }],
  }),
  getEventsFromRoom: builder.query<SerializedCookMasterEvent[], number>({
    query: (roomId) => `rooms/${roomId}/events`,
    providesTags: (_, __, roomId) => [{ type: "Room", id: roomId }],
  }),
  patchRoomById: builder.mutation<Room, { roomId: number; capacity: number }>({
    query: ({ roomId, capacity }) => ({
      url: `rooms/${roomId}`,
      method: "PATCH",
      body: { capacity },
    }),
    invalidatesTags: (_, __, { roomId }) => [{ type: "Room", id: roomId }],
  }),
  deleteRoomById: builder.mutation<void, number>({
    query: (roomId) => ({
      url: `rooms/${roomId}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Room"],
  }),
});
