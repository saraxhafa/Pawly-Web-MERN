import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 fetch orders from backend
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;




/*
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: {},
  lastOrder: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const id = action.payload;
      state.cart[id] = (state.cart[id] || 0) + 1;
    },

    removeFromCart: (state, action) => {
      const id = action.payload;

      if (!state.cart[id]) return;

      state.cart[id] -= 1;

      if (state.cart[id] <= 0) {
        delete state.cart[id];
      }
    },

    clearCart: (state) => {
      state.cart = {};
    },

    setLastOrder: (state, action) => {
      state.lastOrder = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  setLastOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer; */