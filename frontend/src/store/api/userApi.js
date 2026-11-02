
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
    // REGISTER
    register: builder.mutation({
      query: (newUser) => ({
        url: "/users/register",
        method: "POST",
        body: newUser,
      }),
    }),

    // LOGIN
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // LOGOUT
    logout: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
    }),

    // UPDATE PROFILE
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/users/profile",
        method: "PUT",
        body: profileData,
      }),
    }),

    // DELETE PROFILE
    deleteProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} = userApi;
