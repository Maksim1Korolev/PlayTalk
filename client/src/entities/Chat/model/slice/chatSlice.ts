import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { fetchMessages } from "../thunks/fetchMessages";
import { postMessage } from "../thunks/postMessage";
import { ChatState, Message } from "../types/chat";

const initialState: ChatState = {
  chats: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setIsTyping: (
      state,
      action: PayloadAction<{ username: string; isTyping: boolean }>
    ) => {
      const { username, isTyping } = action.payload;
      if (state.chats[username]) {
        state.chats[username].isTyping = isTyping;
      }
    },
    addMessage: (
      state,
      action: PayloadAction<{ username: string; message: Message }>
    ) => {
      const { username, message } = action.payload;

      if (!state.chats[username]) {
        state.chats[username] = {
          messages: [],
          isTyping: false,
          isLoading: false,
          isError: false,
          errorMessage: null,
        };
      }

      state.chats[username].messages.push(message);
      state.chats[username].isTyping = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state, action) => {
        const { recipientUsername } = action.meta.arg;
        if (!state.chats[recipientUsername]) {
          state.chats[recipientUsername] = {
            messages: [],
            isTyping: false,
            isLoading: true,
            isError: false,
            errorMessage: null,
          };
        } else {
          state.chats[recipientUsername].isLoading = true;
          state.chats[recipientUsername].isError = false;
          state.chats[recipientUsername].errorMessage = null;
        }
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { recipientUsername } = action.meta.arg;
        const { messages } = action.payload;

        if (state.chats[recipientUsername]) {
          state.chats[recipientUsername].isLoading = false;
          state.chats[recipientUsername].isError = false;
          state.chats[recipientUsername].messages = messages;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        const { recipientUsername } = action.meta.arg;

        if (state.chats[recipientUsername]) {
          state.chats[recipientUsername].isLoading = false;
          state.chats[recipientUsername].isError = true;
          state.chats[recipientUsername].errorMessage =
            action.payload as string;
        }
      })
      .addCase(postMessage.fulfilled, (state, action) => {
        const { recipientUsername } = action.meta.arg;
        const { message } = action.payload;

        if (!state.chats[recipientUsername]) {
          state.chats[recipientUsername] = {
            messages: [],
            isTyping: false,
            isLoading: false,
            isError: false,
            errorMessage: null,
          };
        }

        state.chats[recipientUsername].messages = [
          ...state.chats[recipientUsername].messages,
          message,
        ];
      });
  },
});

export const { reducer: chatReducer, actions: chatActions } = chatSlice;
