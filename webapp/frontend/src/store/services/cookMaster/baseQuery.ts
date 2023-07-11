import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/dist/query";
import { toast } from "react-hot-toast";

import { setRedirection } from "@/store/redirection/redirectionSlice";
import { RootState } from "@/store/store";

import { GenericError } from "./types";

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3333/api/"
      : "https://cookmaster.site/api/",
  prepareHeaders: (headers, { getState }) => {
    const user = (getState() as RootState).user;
    if (user.token) {
      headers.set("authorization", `Bearer ${user.token}`);
    }
    return headers;
  },
});

// const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 });

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    const error = (result.error as GenericError).data;

    // make sure the error was formatted as expected
    if (!error) {
      toast.error("An error occured");
      return result;
    }

    if (error.statusCode === 401) {
      api.dispatch(setRedirection("/login"));
      return result;
    }

    toast.error(error.message || "An error occured");
  }
  return result;
};

export const finalBaseQuery = baseQueryWithErrorHandling;
