import { $profileApi } from "@/shared/api/api";

export const profileApiService = {
  getProfiles: async (token: string) => {
    const response = await $profileApi.get(`/profiles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.profiles;
  },
};
