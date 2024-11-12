import { createAsyncThunk } from "@reduxjs/toolkit";

// Use js-cookie for managing cookies
import { authApiService } from "../../api/authApiService";

interface AuthResponse {
  token: string;
}

interface AuthArgs {
  username: string;
  password: string;
}

// Sign-In Thunk
export const signIn = createAsyncThunk<
  AuthResponse,
  AuthArgs,
  { rejectValue: string }
>("auth/signIn", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await authApiService.login(username, password);

    // Set cookies on successful login
    document.cookie = `jwt-cookie=${encodeURIComponent(
      JSON.stringify({ currentUsername: username, token: response.token })
    )};path=/`;

    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// Sign-Up Thunk
export const signUp = createAsyncThunk<
  AuthResponse,
  AuthArgs,
  { rejectValue: string }
>("auth/signUp", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await authApiService.register(username, password);

    // Set cookies on successful registration
    document.cookie = `jwt-cookie=${encodeURIComponent(
      JSON.stringify({ currentUsername: username, token: response.token })
    )};path=/`;

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});
