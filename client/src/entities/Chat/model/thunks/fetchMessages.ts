import { createAsyncThunk } from "@reduxjs/toolkit";

import { ThunkConfig } from "@/app/providers";

import { Message } from "../types/chat";

export const fetchMessages = createAsyncThunk<
  { messages: Message[] },
  { recipientUsername: string; token: string },
  ThunkConfig<string>
>(
  "chat/fetchMessages",
  async ({ recipientUsername, token }, { extra, rejectWithValue }) => {
    const { api } = extra;

    try {
      const messages: Message[] = await api.chatApiService.getMessageHistory(
        recipientUsername,
        token
      );

      return { messages };
    } catch (err) {
      console.error("Error fetching users status:", err);
      return rejectWithValue(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  }
);
