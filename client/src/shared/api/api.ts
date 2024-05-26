import axios from "axios";

export const $api = axios.create();

$api.interceptors.request.use((config) => {
  // if (config.headers)
  // //   config.headers.Authorization =
  // //     localStorage.getItem(USER_LOCALSTORAGE_KEY) || "";

  return config;
});
