import { $authApi } from "@/shared/api/api";

export const usersApiService = {
  getUsers: async (token: string) => {
    const response = await $authApi.get(`/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.users;
  },
};
