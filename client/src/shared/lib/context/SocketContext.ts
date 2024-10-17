import { createContext } from "react";
import { Socket } from "socket.io-client";

type SocketContextType = {
  sockets: { communicationSocket: Socket | null; gameSocket: Socket | null };
  setSockets: React.Dispatch<
    React.SetStateAction<{
      communicationSocket: Socket | null;
      gameSocket: Socket | null;
    }>
  >;
};

const defaultSocketContext: SocketContextType = {
  sockets: { communicationSocket: null, gameSocket: null },
  setSockets: () => {},
};

export const SocketContext =
  createContext<SocketContextType>(defaultSocketContext);
