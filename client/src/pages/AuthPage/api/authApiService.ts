import { $authApi, $profileApi } from "@/shared/api/api";

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
    const profileRes = await $profileApi.post("/profiles", { username });

    console.log(profileRes.data + "Register is success");

    return response.data;
  },
};
