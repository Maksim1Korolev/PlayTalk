import { $communicationApi, $gameApi } from "./api";

export const onlineApiService = {
  getOnlineUsernames: async (token: string): Promise<string[]> => {
    try {
      const response = await $communicationApi.get<{
        onlineUsernames: string[];
      }>(`/online/onlineUsernames`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.onlineUsernames;
    } catch (error) {
      console.warn(
        "Communication API failed, falling back to Game API:",
        error
      );

      const fallbackResponse = await $gameApi.get<{
        onlineUsernames: string[];
      }>(`/online/onlineUsernames`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return fallbackResponse.data.onlineUsernames;
    }
  },
};
