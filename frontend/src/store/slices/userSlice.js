
import { createSlice } from "@reduxjs/toolkit";

const localUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: localUser || null,
  isAuthenticated: !!localUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});



export const { setUser, loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
