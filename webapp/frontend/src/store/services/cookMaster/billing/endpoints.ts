import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

import { tagTypes } from "../api";

export const billingEndpoints = (
  builder: EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    (typeof tagTypes)[number],
    string
  >
) => ({
  createBillingIntent: builder.mutation<
    { clientSecret: string; amount: number },
    { productName: string; userId: number }
  >({
    query: ({ productName, userId }) => ({
      url: "billings",
      method: "POST",
      body: {
        productName: productName,
        userId: userId,
      },
    }),
  }),
});
