import { createSelector } from "reselect";

import { StateSchema } from "@/app/providers";

const getChatState = (state: StateSchema) => state.chat.chats;

export const getChatIsTyping = (recipientUsername: string) =>
  createSelector([getChatState], (chats) => chats[recipientUsername]?.isTyping);
