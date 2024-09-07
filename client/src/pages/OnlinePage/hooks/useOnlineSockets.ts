import { useEffect } from "react";
import { User } from "@/entities/User";
import { Socket } from "socket.io-client";

export const useOnlineSockets = ({
  sockets,
  updateUserList,
}: {
  sockets: { communicationSocket: Socket | null; gameSocket: Socket | null };
  updateUserList: (username: string, updatedProps: Partial<User>) => void;
}) => {
  const { communicationSocket, gameSocket } = sockets;

  useEffect(() => {
    if (communicationSocket && gameSocket) {
      const onCommunicationConnect = () => {
        communicationSocket.emit("online-ping");
      };

      const onGameConnect = () => {
        gameSocket.emit("online-ping");
      };

      const updateUserOnline = (username: string, isOnline: boolean) => {
        updateUserList(username, { isOnline });
      };

      const unreadMessageCountChanged = (
        username: string,
        unreadMessageCount: number
      ) => {
        updateUserList(username, { unreadMessageCount });
      };

      communicationSocket.on("connect", onCommunicationConnect);
      gameSocket.on("connect", onGameConnect);

      communicationSocket.on("user-connection", updateUserOnline);
      gameSocket.on("player-connection", updateUserOnline);

      communicationSocket.on(
        "unread-count-messages",
        unreadMessageCountChanged
      );

      return () => {
        communicationSocket.off("connect", onCommunicationConnect);
        gameSocket.off("connect", onGameConnect);
        communicationSocket.off("user-connection", updateUserOnline);
        gameSocket.off("player-connection", updateUserOnline);
        communicationSocket.off(
          "unread-count-messages",
          unreadMessageCountChanged
        );
      };
    }
  }, [communicationSocket, gameSocket, updateUserList]);
};
