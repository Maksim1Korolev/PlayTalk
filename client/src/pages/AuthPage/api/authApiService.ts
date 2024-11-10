import { $authApi, $profileApi } from "@/shared/api/services/api";

export const authApiService = {
  login: async (username: string, password: string) => {
    const response = await $authApi.post(`/auth/login`, {
      username,
      password,
    });

    return response.data;
  },
  register: async (username: string, password: string) => {
    const response = await $authApi.post(`/auth/register`, {
      username,
      password,
    });

    return response.data;
  },
};
