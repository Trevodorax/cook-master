import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/dist/query";
import { GenericError } from "./types";
import { setRedirection } from "@/store/redirection/redirectionSlice";
import { toast } from "react-hot-toast";
import { RootState } from "@/store/store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:3333/api/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 });

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithRetry(args, api, extraOptions);
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
