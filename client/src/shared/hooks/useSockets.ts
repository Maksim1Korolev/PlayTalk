import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { io, Socket } from "socket.io-client";

export const useSockets = (): {
  communicationSocket: Socket | null;
  gameSocket: Socket | null;
} => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const [communicationSocket, setCommunicationSocket] = useState<Socket | null>(
    null
  );
  const [gameSocket, setGameSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token: string = cookies["jwt-cookie"]?.token;

    if (token) {
      const newCommunicationSocket = io(
        import.meta.env.VITE_COMMUNICATION_SOCKET_URL,
        {
          extraHeaders: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setCommunicationSocket(newCommunicationSocket);

      const newGameSocket = io(import.meta.env.VITE_GAME_SOCKET_URL, {
        extraHeaders: {
          authorization: `Bearer ${token}`,
        },
      });
      setGameSocket(newGameSocket);

      return () => {
        newCommunicationSocket.disconnect();
        newGameSocket.disconnect();
      };
    }
  }, [cookies]);

  return { communicationSocket, gameSocket };
};
