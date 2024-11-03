import { $communicationApi } from "./api";

export const chatApiService = {
  getUnreadMessageCount: async (currentUsername: string, token: string) => {
    const response = await $communicationApi.get(
      `/unread/getAll/${currentUsername}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
  //TODO: Delete after transferring socket logic from chatModal
  postAllReadMessages: async (
    currentUsername: string,
    receiverUsername: string,
    token: string
  ) => {
    const usernames = [currentUsername, receiverUsername];
    const response = await $communicationApi.post(
      `/unread/markAsRead/${currentUsername}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        usernames,
      }
    );
    return response.data;
  },
};
