import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3333/api/",
  // prepareHeaders: (headers, { getState }) => {
  //   const token = (getState() as RootState).auth.token;
  //   if (token) {
  //     headers.set("authentication", `Bearer ${token}`);
  //   }
  //   return headers;
  // },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 });

export const api = createApi({
  reducerPath: "cookMaster",
  baseQuery: baseQueryWithRetry,
  endpoints: (builder) => ({
    getTest: builder.query({
      query: () => "bookmarks/test",
    }),
  }),
});

export const { useGetTestQuery } = api;
