import axios from "axios";

import { $profileApi } from "@/pages/MainPage/api/profileApiService";

export const $authApi = axios.create({
  baseURL: `${import.meta.env.VITE_AUTH_SERVICE_API_URL}/auth`,
});

export const apiService = {
  login: async (username: string, password: string) => {
    const response = await $authApi.post(`/login`, {
      username,
      password,
    });

    return response.data;
  },
  register: async (username: string, password: string) => {
    const response = await $authApi.post(`/register`, {
      username,
      password,
    });
    const profileRes = await $profileApi.post("/", { username });

    console.log(profileRes.data + "Register is success");

    return response.data;
  },
};
