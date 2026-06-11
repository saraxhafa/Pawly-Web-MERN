import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://turbo-doodle-7v775r6479wg2p9px-5173.app.github.dev/orders",
    prepareHeaders: (headers) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.token) {
        headers.set("authorization", `Bearer ${user.token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    // 📦 GET ORDERS
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),

    // ➕ CREATE ORDER
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // ❌ DELETE ORDER
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
  useDeleteOrderMutation,
} = ordersApi;