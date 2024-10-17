import { useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "@/shared/lib/context/SocketContext";

export const useSockets = () => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const { setSockets } = useContext(SocketContext);

  useEffect(() => {
    const token: string = cookies["jwt-cookie"]?.token;

    if (token) {
      const newCommunicationSocket: Socket = io(
        import.meta.env.VITE_COMMUNICATION_SOCKET_URL,
        {
          extraHeaders: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const newGameSocket: Socket = io(import.meta.env.VITE_GAME_SOCKET_URL, {
        extraHeaders: {
          authorization: `Bearer ${token}`,
        },
      });

      setSockets({
        communicationSocket: newCommunicationSocket,
        gameSocket: newGameSocket,
      });

      return () => {
        newCommunicationSocket.disconnect();
        newGameSocket.disconnect();
      };
    }
  }, [cookies, setSockets]);
};
