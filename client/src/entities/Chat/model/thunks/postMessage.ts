import { createAsyncThunk } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { ThunkConfig } from "@/app/providers";
import { getCurrentUser } from "@/entities/User";

import { Message } from "../types/chat";

export const postMessage = createAsyncThunk<
  { message: Message },
  {
    recipientUsername: string;
    message: string;
    communicationSocket?: Socket | null;
  },
  ThunkConfig<string>
>(
  "chat/sendMessage",
  async ({ recipientUsername, message, communicationSocket }, { getState }) => {
    const state = getState();
    const currentUser = getCurrentUser(state);

    const newMessage: Message = {
      message,
      date: new Date().toISOString(),
      username: currentUser!.username,
    };

    if (communicationSocket) {
      communicationSocket.emit("send-message", {
        recipientUsername,
        message: newMessage,
      });
    }

    return { message: newMessage };
  }
);
