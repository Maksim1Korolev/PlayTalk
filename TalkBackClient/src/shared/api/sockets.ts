import { io } from "socket.io-client";
export const onlineSocket = io(import.meta.env.VITE_ONLINE_SOCKET_URL);
