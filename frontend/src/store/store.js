import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import ordersReducer from "./slices/orderSlice";
import cartReducer from "./slices/cardSlice";

// APIs
import { userApi } from "./api/userApi";
import { taskApi } from "./api/taskApi";
import { ordersApi } from "./api/ordersApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    orders: ordersReducer,
    cart: cartReducer,

    [userApi.reducerPath]: userApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      taskApi.middleware,
      ordersApi.middleware
    ),
});