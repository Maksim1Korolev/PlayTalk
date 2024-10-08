import axios from "axios";

export const $profileApi = axios.create({
  baseURL: import.meta.env.VITE_PROFILE_REPOSITORY_SERVICE_URL,
});

export const profileApiService = {
  getProfiles: async (token: string) => {
    const response = await $profileApi.get(`/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.profiles;
  },
};
