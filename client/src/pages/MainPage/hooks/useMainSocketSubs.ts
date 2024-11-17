import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";

import { usersApiService } from "@/shared/api";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { SocketContext } from "@/shared/lib/context/SocketContext";

import { chatActions } from "@/entities/Chat";
import { getUsers, User, userActions } from "@/entities/User";

export const useMainSocketSubs = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(getUsers);

  const [cookies] = useCookies();
  const { token } = cookies["jwt-cookie"];

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

      const updateUserOnline = async (username: string, isOnline: boolean) => {
        const userExists = !!users[username];

        if (userExists) {
          dispatch(
            userActions.updateUser({ username, updatedProps: { isOnline } })
          );

          if (!isOnline) {
            dispatch(chatActions.setIsTyping({ username, isTyping: false }));
          }
        } else {
          //Waiting a second for profile service to register the user to see the avatar
          setTimeout(async () => {
            const user = await usersApiService.getUser(username, token);

            if (user) {
              const newUser: User = {
                ...user,
                isOnline,
              };

              dispatch(userActions.addUser(newUser));
            }
          }, 1000);
        }
      };

      //TODO: This is called thrice on chat open (Meaning 3 emits?)
      const unreadMessageCountChanged = ({
        username,
        unreadMessageCount,
      }: {
        username: string;
        unreadMessageCount: number;
      }) => {
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
        "unread-messages-count",
        unreadMessageCountChanged
      );

      return () => {
        communicationSocket.off("connect", onCommunicationConnect);
        gameSocket.off("connect", onGameConnect);
        communicationSocket.off("user-connection", updateUserOnline);
        gameSocket.off("player-connection", updateUserOnline);
        communicationSocket.off(
          "unread-messages-count",
          unreadMessageCountChanged
        );
      };
    }
  }, [users, communicationSocket, dispatch, gameSocket]);
};
