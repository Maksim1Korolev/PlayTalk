import { User } from "@/entities/User";

import { $authApi, $profileApi } from "./api";

export const usersApiService = {
  getUsers: async (token: string): Promise<User[]> => {
    try {
      const profileResponse = await $profileApi.get<{ profiles: User[] }>(
        `/profiles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return profileResponse.data.profiles;
    } catch (error) {
      console.warn("Profile API failed, falling back to Auth API:", error);

      const authResponse = await $authApi.get<{ users: User[] }>(`/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return authResponse.data.users;
    }
  },
};
