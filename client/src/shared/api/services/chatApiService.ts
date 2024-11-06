import { Message } from "@/entities/Chat";

import { $communicationApi } from "./api";

export interface UnreadMessageCounts {
  [username: string]: number;
}

export const chatApiService = {
  getUnreadMessageCount: async (
    token: string
  ): Promise<UnreadMessageCounts> => {
    const response = await $communicationApi.get(`/unread/getAll`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getMessageHistory: async (
    recipientUsername: string,
    token: string
  ): Promise<Message[]> => {
    const response = await $communicationApi.get(
      `/messageHistories/${recipientUsername}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.messageHistory;
  },
};
