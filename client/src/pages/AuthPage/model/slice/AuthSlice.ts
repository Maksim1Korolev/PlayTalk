import { createSlice } from "@reduxjs/toolkit";

import { signIn, signUp } from "../thunks/authThunks";
import { AuthState } from "../types/auth";

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Sign-In
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(signIn.fulfilled, (state) => {
      state.isAuthenticated = true;
      state.loading = false;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Sign-Up
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(signUp.fulfilled, (state) => {
      state.isAuthenticated = true;
      state.loading = false;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const authReducer = authSlice.reducer;
