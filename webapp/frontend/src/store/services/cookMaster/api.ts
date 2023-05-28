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
import { buildQueryParams } from "../utils/buildQueryParams";
import { toast } from "react-hot-toast";

export type userType = "any" | "contractor" | "client" | "admin";

export interface UserInfo {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  userType: userType;
  admin: {
    isConfirmed: boolean;
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
  firstName: string;
  lastName: string;
  userType: userType;
}

export interface UserSearchParams {
  search: string | null;
  userType: userType | null;
}

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
    if (result.error.status === 401) {
      api.dispatch(setRedirection("/login"));
      return result;
    }

    toast(result?.error?.data?.message || "An error occured");
  }
  return result;
};

export const api = createApi({
  reducerPath: "cookMaster",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    createAccount: builder.mutation<LoginResponse, CreateAccountRequest>({
      query: (accountInformations) => ({
        url: "auth/signup",
        method: "POST",
        body: accountInformations,
      }),
      invalidatesTags: ["User"],
    }),
    getUserInfo: builder.mutation<UserInfo, void>({
      query: () => "users/me",
    }),
    getAllUsers: builder.query<UserInfo[], UserSearchParams>({
      query: (searchParams) => {
        const queryParams = buildQueryParams(searchParams);
        return "users" + queryParams;
      },
      providesTags: ["User"],
    }),
    getUserById: builder.query<UserInfo, string>({
      query: (id) => `users/${id}`,
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    patchUser: builder.mutation<
      UserInfo,
      { id: string; data: Partial<UserInfo> }
    >({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    confirmAdmin: builder.mutation<UserInfo, { id: string }>({
      query: ({ id }) => ({
        url: "users/confirmAdmin",
        method: "PATCH",
        body: { id },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserInfoMutation,
  useCreateAccountMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  usePatchUserMutation,
  useConfirmAdminMutation,
} = api;
