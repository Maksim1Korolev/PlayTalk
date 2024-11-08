import { useContext, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { SocketContext } from "@/shared/lib/context/SocketContext";

import { getUsers, User, userActions } from "@/entities/User";

export const useMainSocketSubs = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(getUsers);

  const { sockets } = useContext(SocketContext);
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
        const userExists = !!users[username];

        if (userExists) {
          dispatch(
            userActions.updateUser({ username, updatedProps: { isOnline } })
          );
        } else {
          //TODO:Add fetching a specific user from api service
          const newUser: User = {
            username,
            isOnline,
          };

          dispatch(userActions.addUser(newUser));
        }
      };

      const unreadMessageCountChanged = (
        username: string,
        unreadMessageCount: number
      ) => {
        dispatch(
          userActions.updateUser({
            username,
            updatedProps: { unreadMessageCount },
          })
        );
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
  }, [communicationSocket, gameSocket, dispatch, users]);
};
