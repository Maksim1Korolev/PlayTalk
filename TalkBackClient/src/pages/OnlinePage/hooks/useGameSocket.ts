import { Player } from "@/entities/Player";
import { onlineSocket } from "@/shared/api/sockets";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
export interface ChatModalStateProps {
  player: Player;
}

export const useOnlineSocket = ({
  username,
  data,
}: {
  username: string;
  data?: Player[];
}) => {
  const [onlineUsernames, setOnlineUsernames] = useState<string[]>([]);
  const [upToDateUsers, setUpToDateUsers] = useState<Player[]>();
  const [chatModals, setChatModals] = useState<ChatModalStateProps[]>();
  const [cookies] = useCookies();
  const { user }: { user: Player } = cookies["jwt-cookie"];

  const setUsersOnline = useCallback(
    (usernames: string[], fetchedUsers?: Player[]) => {
      const usersToUpdate = fetchedUsers || upToDateUsers;
      if (!usersToUpdate) return;

      const updatedUsers = usersToUpdate.map((user: Player) => ({
        ...user,
        isOnline: usernames.includes(user.username),
      }));

      setUpToDateUsers(updatedUsers);
    },
    [upToDateUsers]
  );

  useEffect(() => {
    const onConnect = () => {
      onlineSocket.emit("online-ping", username);
    };

    const updateOnlineUsers = (usernames: string[]) => {
      setOnlineUsernames(usernames);
      if (!data) setUsersOnline(usernames, data);
    };

    const updateUserOnline = (username: string, isOnline: boolean) => {
      setOnlineUsernames((prev) => {
        if (isOnline) {
          return prev.includes(username) ? prev : [...prev, username];
        } else {
          return prev.filter((u) => u !== username);
        }
      });
      setUpToDateUsers((prevUsers) => {
        if (!prevUsers) return [];

        prevUsers.reduce;

        return prevUsers?.map((user) => {
          if (user.username == username) {
            return { ...user, isOnline };
          }
          return user;
        });
      });
    };

    /////////////////////////////////////////////////////
    onlineSocket.on("connect", onConnect);
    onlineSocket.on("online-users", updateOnlineUsers);
    onlineSocket.on("user-connection", updateUserOnline);
    /////////////////////////////////////////////////////

    return () => {
      onlineSocket.close();
    };
  }, []);

  const handleUserMessage = (receiverUsername: string, message: string) => {
    onlineSocket.emit("send-message", {
      senderUsername: user.username,
      receiverUsername,
      message,
    });
  };

  const receiveMessageSubscribe = (
    senderUsername: string,
    callback: (message: string) => void
  ) => {
    const eventName = `receive-message-${senderUsername}`;

    console.log(eventName);

    const getMessage = (message: string) => {
      console.log(message);

      callback(message);
    };

    onlineSocket.on(eventName, getMessage);

    // Return a cleanup function to unsubscribe from the event
    return () => {
      onlineSocket.off(eventName);
    };
  };
  return {
    setUsersOnline,
    chatModals,
    setChatModals,
    handleUserMessage,
    onlineUsernames,
    upToDateUsers,
    receiveMessageSubscribe,
  };
};

export const useReceiveMessage = (
  receiveMessage: ({
    senderUsername,
    message,
  }: {
    senderUsername: string;
    message: string;
  }) => void
) => {
  onlineSocket.on("receive-message", receiveMessage);

  return () => {
    onlineSocket.off("receive-message");
  };
};
