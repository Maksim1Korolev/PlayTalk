import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { SocketContext } from "@/shared/lib/context/SocketContext";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [sockets, setSockets] = useState<{
    communicationSocket: Socket | null;
    gameSocket: Socket | null;
  }>({
    communicationSocket: null,
    gameSocket: null,
  });

  return (
    <SocketContext.Provider
      value={{
        sockets,
        setSockets,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
