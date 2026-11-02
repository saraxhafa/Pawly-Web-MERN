
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,

    prepareHeaders: (headers) => {
      try {
        const user = JSON.parse(
          localStorage.getItem("user") || "null"
        );

        if (user?.token) {
          headers.set(
            "Authorization",
            `Bearer ${user.token}`
          );
        }
      } catch (error) {
        console.error("Unable to read user session:", error);
      }

      return headers;
    },
  }),

  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    // GET MY ORDERS
    getOrders: builder.query({
      query: () => "/orders/myorders",
      providesTags: ["Orders"],
    }),

    // CREATE ORDER
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders/createorder",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // UPDATE ORDER
    updateOrder: builder.mutation({
      query: ({ id, ...orderData }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // DELETE ORDER
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = ordersApi;
