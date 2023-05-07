import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

interface TestResponse {
  message: string;
}

export interface GenericError {
  data: {
    error: string;
    message: string;
    statusCode: number;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3333/api/",
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 });

export const api = createApi({
  reducerPath: "cookMaster",
  baseQuery: baseQueryWithRetry,
  endpoints: (builder) => ({
    getTest: builder.query<TestResponse, void>({
      query: () => "bookmarks/test",
    }),
  }),
});

export const { useGetTestQuery } = api;
