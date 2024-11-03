import { $communicationApi } from "@/shared/api/api";

//TODO:Divide existent logic, add online from game gateway service
export const communicationApiService = {
  getOnlineUsernames: async (token: string) => {
    const response = await $communicationApi.get(
      `/api/online/onlineUsernames`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.onlineUsernames;
  },
  getUnreadMessageCount: async (currentUsername: string, token: string) => {
    const response = await $communicationApi.get(
      `/api/unread/getAll/${currentUsername}`,
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
      `/api/unread/markAsRead/${currentUsername}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        usernames,
      }
    );
    return response.data;
  },
};
