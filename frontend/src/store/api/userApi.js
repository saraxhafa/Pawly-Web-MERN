
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,

    prepareHeaders: (headers) => {
      try {
        const storedUser = JSON.parse(
          localStorage.getItem("user") || "null"
        );

        if (storedUser?.token) {
          headers.set(
            "Authorization",
            `Bearer ${storedUser.token}`
          );
        }
      } catch (error) {
        console.error("Unable to read user session:", error);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    register: builder.mutation({
      query: (newUser) => ({
        url: "/users/register",
        method: "POST",
        body: newUser,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = userApi;
