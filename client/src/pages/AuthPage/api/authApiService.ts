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
    try {
      const profileRes = await $profileApi.post("/profiles", { username }); //TODO:Move and update logic
      console.log(
        profileRes.data +
          "Registration successful with user added to profile service"
      );
    } catch (error) {
      console.log(
        response.data +
          "Registration successful without user added to profile service"
      );
    }

    return response.data;
  },
};
