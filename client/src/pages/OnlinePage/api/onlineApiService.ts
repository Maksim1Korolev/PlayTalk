import axios from "axios";

export const $onlineApi = axios.create({
  baseURL: import.meta.env.VITE_COMMUNICATION_SOCKET_URL,
});

export const onlineApiService = {
  getOnlineUsernames: async (token: string) => {
    const response = await $onlineApi.get(`/api/connection/onlineUsernames`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.onlineUsernames;
  },
  getUnreadMessageCount: async (currentUsername: string, token: string) => {
    const response = await $onlineApi.get(
      `/api/chat/unread/${currentUsername}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
  postAllReadMessages: async (
    currentUsername: string,
    receiverUsername: string,
    token: string
  ) => {
    const usernames = [currentUsername, receiverUsername];
    const response = await $onlineApi.post(
      `/api/chat/unread/markAsRead/${currentUsername}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        usernames,
      }
    );
    return response.data;
  },
};
