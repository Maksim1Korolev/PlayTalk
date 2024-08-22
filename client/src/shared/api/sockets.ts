import { io } from "socket.io-client";
export const communicationSocket = io(
  import.meta.env.VITE_COMMUNICATION_SOCKET_URL
);

export const gameSocket = io(import.meta.env.VITE_GAME_SOCKET_URL);
