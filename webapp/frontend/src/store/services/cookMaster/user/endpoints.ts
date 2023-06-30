import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {
  CreateAccountRequest,
  LoginRequest,
  LoginResponse,
  User,
  UserInfo,
  UserSearchParams,
} from "../types";
import { buildQueryParams } from "../../utils/buildQueryParams";
import { tagTypes } from "../api";

export const userEndpoints = (
  builder: EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    (typeof tagTypes)[number],
    string
  >
) => ({
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
  getMe: builder.mutation<User, void>({
    query: () => "users/me",
  }),
  getMyConversations: builder.query<User[], void>({
    query: () => "users/me/conversations",
  }),
  getAllUsers: builder.query<User[], UserSearchParams>({
    query: (searchParams) => {
      const queryParams = buildQueryParams(searchParams);
      return "users" + queryParams;
    },
    providesTags: (result) =>
      result
        ? [
            ...result.map(({ id }) => ({
              type: "User" as const,
              id: id.toString(),
            })),
            "User",
          ]
        : ["User"],
  }),
  getUserById: builder.query<UserInfo, string>({
    query: (id) => `users/${id}`,
    providesTags: (_, __, arg) => [{ type: "User", id: arg }],
  }),
  deleteUser: builder.mutation<void, string>({
    query: (id) => ({
      url: `users/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (_, __, arg) => [{ type: "User", id: arg }],
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
    invalidatesTags: (_, __, arg) => [{ type: "User", id: arg.id }],
  }),
  patchMe: builder.mutation<User, { data: Partial<User> }>({
    query: ({ data }) => ({
      url: "users/me",
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
    invalidatesTags: (_, __, arg) => [{ type: "User", id: arg.id }],
  }),
});
