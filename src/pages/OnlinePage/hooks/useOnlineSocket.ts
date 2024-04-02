import { useCallback, useEffect, useState } from "react";
import { User } from "@/entities/User";
import { onlineSocket } from "@/shared/api/sockets";

export const useOnlineSocket = ({
  username,
  data,
}: {
  username: string;
  data?: User[];
}) => {
  const [onlineUsernames, setOnlineUsernames] = useState<string[]>([]);
  const [upToDateUsers, setUpToDateUsers] = useState<User[]>();

  const setUsersOnline = useCallback(
    (usernames: string[], fetchedUsers?: User[]) => {
      const usersToUpdate = fetchedUsers || upToDateUsers;
      if (!usersToUpdate) return;

      const updatedUsers = usersToUpdate.map((user: User) => ({
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
      setUsersOnline(usernames, data);
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
        return prevUsers.map((user) => ({
          ...user,
          isOnline: user.username === username ? isOnline : user.isOnline,
        }));
      });
    };

    onlineSocket.on("connect", onConnect);
    onlineSocket.on("online-users", updateOnlineUsers);
    onlineSocket.on("user-connection", updateUserOnline);

    return () => {
      onlineSocket.disconnect();
    };
  }, [username, data, setUsersOnline]);

  return {
    setUsersOnline,
    onlineUsernames,
    upToDateUsers,
  };
};
