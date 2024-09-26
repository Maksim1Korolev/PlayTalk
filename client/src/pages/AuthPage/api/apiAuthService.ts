import axios from "axios";

export const $authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
});
export const $profileApi = axios.create({
  baseURL: import.meta.env.VITE_PROFILE_REPOSITORY_SERVICE_URL,
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
