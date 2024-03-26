import { useCallback, useEffect, useState } from "react";
import { User } from "../../../entities/User";
import { onlineSocket } from "../api/sockets";

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
      console.log(usernames);
      console.log(onlineUsernames);
      console.log("- usernames SetUsersOnline");

      const updatedUsers = usersToUpdate.map((user: User) => ({
        ...user,
        isOnline: usernames.includes(user.username),
      }));

      setUpToDateUsers(updatedUsers);
    },
    [onlineUsernames, upToDateUsers]
  );

  useEffect(() => {
    const onConnect = () => {
      onlineSocket.emit("online-ping", username);
    };

    const updateOnlineUsers = (usernames: string[]) => {
      console.log(usernames);
      console.log("usernames 123");

      setOnlineUsernames(usernames);
      if (!data) setUsersOnline(usernames, data);
      console.log(usernames + " - usernames");
      console.log(data + " - updateOnlineUsers data");
    };

    const updateUserOnline = (username: string, isOnline: boolean) => {
      console.log(username + " - updateUserOnline username");
      console.log(upToDateUsers + " - updateUserOnline users");
      setOnlineUsernames((prev) => {
        if (isOnline) {
          return prev.includes(username) ? prev : [...prev, username];
        } else {
          return prev.filter((u) => u !== username);
        }
      });
      setUpToDateUsers((prevUsers) => {
        if (!prevUsers) return [];
        console.log("prev users before");
        console.log(prevUsers);

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

  return {
    setUsersOnline,
    onlineUsernames,
    upToDateUsers,
  };
};
