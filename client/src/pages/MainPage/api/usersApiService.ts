import { $authApi, $profileApi } from "@/shared/api/api";

export const usersApiService = {
  getUsers: async (token: string) => {
    try {
      const profileResponse = await $profileApi.get(`/profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return profileResponse.data.profiles;
    } catch (error) {
      console.warn("Profile API failed, falling back to Auth API: ", error);

      const authResponse = await $authApi.get(`/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return authResponse.data.users;
    }
  },
};
