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

  postAllReadMessages: async (
    recipientUsername: string,
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await $communicationApi.post(
      `/unread/markAsRead/${recipientUsername}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};
