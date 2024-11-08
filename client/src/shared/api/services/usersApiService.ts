import { User } from "@/entities/User";

import { $authApi, $profileApi } from "./api";

export const usersApiService = {
  // Fetches all users with fallback between Profile and Auth APIs
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

      try {
        const authResponse = await $authApi.get<{ users: User[] }>(`/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return authResponse.data.users;
      } catch (authError) {
        console.error(
          "Both Profile and Auth APIs failed to retrieve users:",
          authError
        );
        return [];
      }
    }
  },

  getUser: async (username: string, token: string): Promise<User | null> => {
    try {
      const profileResponse = await $profileApi.get<{ profile: User }>(
        `/profiles/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return profileResponse.data.profile;
    } catch (error) {
      console.warn(
        `Profile API failed to retrieve ${username}, falling back to Auth API:`,
        error
      );

      //TODO:Add this route to auth
      try {
        const authResponse = await $authApi.get<{ user: User }>(
          `/users/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return authResponse.data.user;
      } catch (authError) {
        console.error(
          `Both Profile and Auth APIs failed to retrieve ${username}:`,
          authError
        );
        return null;
      }
    }
  },
};
