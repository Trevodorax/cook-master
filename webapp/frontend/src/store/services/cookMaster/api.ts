import { setRedirection } from "@/store/redirection/redirectionSlice";
import { RootState } from "@/store/store";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react";

interface TestResponse {
  message: string;
}

export interface UserInfo {
  data: {
    id: number;
    createdAt: string;
    updatedAt: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export interface GenericError {
  data: {
    error: string;
    message: string;
    statusCode: number;
  };
}

export interface CreateAccountRequest {
  email: string;
  password: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3333/api/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 });

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithRetry(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(setRedirection("/login"));
  }
  return result;
};

export const api = createApi({
  reducerPath: "cookMaster",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getTest: builder.query<TestResponse, void>({
      query: () => "bookmarks/test",
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    createAccount: builder.mutation<LoginResponse, CreateAccountRequest>({
      query: (credentials) => ({
        url: "auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserInfo: builder.mutation<UserInfo, void>({
      query: () => "users/me",
    }),
  }),
});

export const {
  useGetTestQuery,
  useLoginMutation,
  useGetUserInfoMutation,
  useCreateAccountMutation,
} = api;
