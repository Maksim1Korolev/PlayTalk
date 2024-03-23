import axios from "axios";

export const $api = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const apiService = {
  login: async (username: string, password: string) => {
    const response = await $api.post(`/login`, {
      username,
      password,
    });
    return response.data;
  },
};
