import { io } from "socket.io-client";
export const onlineSocket = io(import.meta.env.VITE_ONLINE_SOCKET_URL);
export const chatSocket = io(import.meta.env.VITE_CHAT_SOCKET_URL);
