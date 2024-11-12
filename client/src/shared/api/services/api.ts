import axios from "axios";

export const $api = axios.create();

//TODO:Check
//$api.interceptors.request.use((config) => {
//  // if (config.headers)
//  // //   config.headers.Authorization =
//  // //     localStorage.getItem(USER_LOCALSTORAGE_KEY) || "";

//  return config;
//});

export const $authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_API_URL,
});

export const $profileApi = axios.create({
  baseURL: import.meta.env.VITE_PROFILE_SERVICE_API_URL,
});

export const $gameApi = axios.create({
  baseURL: `${import.meta.env.VITE_GAME_SOCKET_URL}/api`,
});

export const $communicationApi = axios.create({
  baseURL: `${import.meta.env.VITE_COMMUNICATION_SOCKET_URL}/api`,
});
