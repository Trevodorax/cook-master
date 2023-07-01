import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

import { Client, CookMasterEvent, SerializedCookMasterEvent } from "../types";
import { buildQueryParams } from "../../utils/buildQueryParams";
import { CreateEventDto, serializeCreateEventDto } from "./dto";
import { tagTypes } from "../api";

export const eventEndpoints = (
  builder: EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    (typeof tagTypes)[number],
    string
  >
) => ({
  getAllEvents: builder.query<
    CookMasterEvent[],
    { filters: { day?: string; term?: string } }
  >({
    query: ({ filters }) => {
      const queryParams = buildQueryParams(filters);

      return "events" + queryParams;
    },
    providesTags: ["Event"],
  }),
  getMyEvents: builder.query<CookMasterEvent[], void>({
    query: () => "contractors/me/events",
    providesTags: ["Event"],
  }),
  createEvent: builder.mutation<CookMasterEvent, CreateEventDto>({
    query: (newEventData) => ({
      url: "events",
      method: "POST",
      body: serializeCreateEventDto(newEventData),
    }),
    invalidatesTags: ["Event"],
  }),
  getEventById: builder.query<SerializedCookMasterEvent, string>({
    query: (id) => `events/${id}`,
    providesTags: (_, __, arg) => [{ type: "Event", id: arg }],
  }),
  patchEvent: builder.mutation<
    SerializedCookMasterEvent,
    { id: string; data: Partial<CookMasterEvent> }
  >({
    query: ({ id, data }) => ({
      url: `events/${id}`,
      method: "PATCH",
      body: data,
    }),
    invalidatesTags: (_, __, arg) => [{ type: "Event", id: arg.id }],
  }),
  addUserToEvent: builder.mutation<
    CookMasterEvent,
    { eventId: string; clientId: number }
  >({
    query: ({ eventId, clientId }) => ({
      url: `events/${eventId}/clients`,
      method: "POST",
      body: { clientId },
    }),
    invalidatesTags: (_, __, arg) => [{ type: "Event", id: arg.eventId }],
  }),
  getClientsFromEvent: builder.query<Client[], string>({
    query: (eventId) => `events/${eventId}/clients`,
    providesTags: (_, __, arg) => [{ type: "Event", id: arg }],
  }),
  deleteEvent: builder.mutation<CookMasterEvent, string>({
    query: (id) => ({
      url: `events/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Event"],
  }),
});
