import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

import { Message } from "../types";
import { tagTypes } from "../api";

export type Channel = "redux" | "general";

export const chatEndpoints = (
  builder: EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    (typeof tagTypes)[number],
    string
  >
) => ({
  getMyMessagesWith: builder.mutation<Message[], number>({
    query: (otherUserId) => `chat/${otherUserId}`,
  }),
});
