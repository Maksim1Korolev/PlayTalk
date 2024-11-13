import { createAsyncThunk } from "@reduxjs/toolkit";

import { authApiService } from "../../api/authApiService";

interface AuthResponse {
  token: string;
}

interface AuthArgs {
  username: string;
  password: string;
}

export const signIn = createAsyncThunk<
  AuthResponse,
  AuthArgs,
  { rejectValue: string }
>("auth/signIn", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await authApiService.login(username, password);

    document.cookie = `jwt-cookie=${encodeURIComponent(
      JSON.stringify({ token: response.token })
    )};path=/`;
    localStorage.setItem("currentUsername", username);

    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const signUp = createAsyncThunk<
  AuthResponse,
  AuthArgs,
  { rejectValue: string }
>("auth/signUp", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await authApiService.register(username, password);

    document.cookie = `jwt-cookie=${encodeURIComponent(
      JSON.stringify({ currentUsername: username, token: response.token })
    )};path=/`;
    localStorage.setItem("currentUsername", username);

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});
