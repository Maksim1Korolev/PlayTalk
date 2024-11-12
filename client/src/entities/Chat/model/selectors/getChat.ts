import { createSelector } from "reselect";

import { StateSchema } from "@/app/providers";

const getChatState = (state: StateSchema) => state.chat.chats;

export const getChatMessages = (recipientUsername: string) =>
  createSelector(
    [getChatState],
    (chats) => chats[recipientUsername]?.messages || []
  );
