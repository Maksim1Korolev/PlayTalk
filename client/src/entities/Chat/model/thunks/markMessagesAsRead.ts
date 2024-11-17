import { createAsyncThunk } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { ThunkConfig } from "@/app/providers";

export const markMessagesAsRead = createAsyncThunk<
  void,
  { usernames: string[]; communicationSocket?: Socket | null },
  ThunkConfig<string>
>("chat/markMessagesAsRead", async ({ usernames, communicationSocket }) => {
  if (!communicationSocket) {
    console.error("Socket connection is not available");
    return;
  }

  communicationSocket.emit("messages-read", {
    usernames,
  });
});
