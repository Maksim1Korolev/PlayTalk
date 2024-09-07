import React, { useState, useMemo } from "react";
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

  const defaultValue = useMemo(
    () => ({
      sockets,
      setSockets,
    }),
    [sockets]
  );

  return (
    <SocketContext.Provider value={defaultValue}>
      {children}
    </SocketContext.Provider>
  );
};
