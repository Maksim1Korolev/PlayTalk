import { User } from "@/entities/User";
import { Message } from "@/features/Chat/ui/ChatMessage/ui/ChatMessage";
import { onlineSocket } from "@/shared/api/sockets";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
export interface ChatModalStateProps {
  user: User;
}

export const useOnlineSocket = ({ data }: { data?: User[] }) => {
  const [onlineUsernames, setOnlineUsernames] = useState<string[]>([]);
  const [usersWithOnlineStatus, setUsersWithOnlineStatus] = useState<User[]>();
  const [chatModals, setChatModals] = useState<ChatModalStateProps[]>();
  const [cookies] = useCookies();
  const { user }: { user: User } = cookies["jwt-cookie"];

  const setUsersOnline = useCallback(
    (usernames: string[], fetchedUsers?: User[]) => {
      const usersToUpdate = fetchedUsers || usersWithOnlineStatus;
      if (!usersToUpdate) return fetchedUsers;

      const updatedUsers = usersToUpdate.map((user: User) => ({
        ...user,
        isOnline: usernames.includes(user.username),
      }));

      setUsersWithOnlineStatus(updatedUsers);

      return updatedUsers;
    },
    [usersWithOnlineStatus]
  );

  useEffect(() => {
    const onConnect = () => {
      onlineSocket.emit("online-ping", user.username);
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
      setUsersWithOnlineStatus((prevUsers) => {
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

  const handleUserMessage = useCallback(
    (receiverUsername: string, message: Message) => {
      onlineSocket.emit("send-message", {
        senderUsername: user.username,
        receiverUsername,
        message,
      });
    },
    [user.username]
  );

  return {
    setUsersOnline,
    chatModals,
    setChatModals,
    handleUserMessage,
    onlineUsernames,
    usersWithOnlineStatus,
  };
};

export const useReceiveMessage = (
  receiverUsername: string,
  receiveMessage: ({
    senderUsername,
    message,
  }: {
    senderUsername: string;
    message: Message;
  }) => void,
  updateChatHistory: (messages: Message[], receiverUsername: string) => void
) => {
  onlineSocket.emit("on-chat-open", receiverUsername);
  onlineSocket.on("update-chat", updateChatHistory);
  onlineSocket.on("receive-message", receiveMessage);

  return () => {
    onlineSocket.off("update-chat", updateChatHistory);
    onlineSocket.off("receive-message", receiveMessage);
  };
};
