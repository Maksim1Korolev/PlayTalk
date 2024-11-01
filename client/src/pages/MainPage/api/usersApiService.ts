import axios from "axios";

export const $usersApi = axios.create({
  baseURL: `${import.meta.env.VITE_AUTH_SERVICE_API_URL}/users`,
});

export const usersApiService = {
  getUsers: async (token: string) => {
    const response = await $usersApi.get(`/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.users;
  },
};
