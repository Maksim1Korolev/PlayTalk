import { useCookies } from "react-cookie";
import { io } from "socket.io-client";

const [cookies] = useCookies(["jwt-cookie"]);
const token: string = cookies["jwt-cookie"]?.token;

export const communicationSocket = io(
  import.meta.env.VITE_COMMUNICATION_SOCKET_URL,
  {
    extraHeaders: {
      authorization: `Bearer ${token}`,
    },
  }
);

export const gameSocket = io(import.meta.env.VITE_GAME_SOCKET_URL, {
  extraHeaders: {
    authorization: `Bearer ${token}`,
  },
});
