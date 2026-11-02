
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      const token = storedUser?.token;

      if (!token) {
        return thunkAPI.rejectWithValue({
          message: "You must log in first",
        });
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: "Unable to fetch orders",
        }
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    loading: false,
  },

  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.loading = false;
    },
  },

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


export const { clearOrders } = orderSlice.actions;

export default orderSlice.reducer;
