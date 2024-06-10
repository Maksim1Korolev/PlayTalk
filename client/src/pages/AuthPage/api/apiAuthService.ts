import axios from "axios";

export const $api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
});

export const apiService = {
  login: async (username: string, password: string) => {
    const response = await $api.post(`/login`, {
      username,
      password,
    });

    return response.data;
  },
  register: async (username: string, password: string) => {
    const response = await $api.post(`/register`, {
      username,
      password,
    });

    return response.data;
  },
};
