import axios from "axios";
import { useCookies } from "react-cookie";

export const $api = axios.create({
  baseURL: import.meta.env.VITE_USERS_SERVER_URL,
});

export const apiService = {
  getUsers: async (token: string) => {
    const response = await $api.get(`/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.users;
  },
};
