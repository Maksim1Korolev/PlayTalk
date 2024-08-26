import { User } from "@/entities/User";
import {
  gameSocket,
  communicationSocket as communicationSocket,
} from "@/shared/api/sockets";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export const useOnlineSocket = ({
  updateUserList,
}: {
  updateUserList: (username: string, updatedProps: Partial<User>) => void;
}) => {

  const [cookies] = useCookies();
  const { user }: { user: User } = cookies["jwt-cookie"];

  useEffect(() => {
    const onCommunicationConnect = () => {
      communicationSocket.emit("online-ping", user.username);
    };
    const onGameConnect = () => {
      gameSocket.emit("online-ping", user.username);
    };

    const updateUserOnline = (username: string, isOnline: boolean) => {
      updateUserList(username, { isOnline });
    };

    //Chat Logic
    const unreadMessageCountChanged = (
      username: string,
      unreadMessageCount: number
    ) => {
      updateUserList(username, { unreadMessageCount });
    };

    /////////////////////////////////////////////////////
    communicationSocket.on("connect", onCommunicationConnect);
    gameSocket.on("connect", onGameConnect);

    communicationSocket.on("user-connection", updateUserOnline);
    gameSocket.on("player-connection", updateUserOnline);

    /////////////////////////////////////////////////////
    communicationSocket.on("unread-count-messages", unreadMessageCountChanged);

    return () => {
      communicationSocket.off("connect", onCommunicationConnect);
      gameSocket.off("connect", onGameConnect);
      communicationSocket.off("user-connection", updateUserOnline);
      gameSocket.off("player-connection", updateUserOnline);
      communicationSocket.off(
        "unread-count-messages",
        unreadMessageCountChanged
      );
      communicationSocket.close();
    };
  }, []);
};
