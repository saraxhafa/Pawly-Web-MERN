import { createSlice } from '@reduxjs/toolkit';

const localUser = JSON.parse(localStorage.getItem('user'));

//dashboard
// redux/userSlice.js

const initialState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  setUser: (state, action) => {
      state.user = action.payload;
    },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, setUser, logout } = userSlice.actions;
export default userSlice.reducer;
