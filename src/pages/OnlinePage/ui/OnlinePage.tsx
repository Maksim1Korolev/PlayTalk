import { memo, useEffect, useState } from "react";
import cls from "./OnlinePage.module.scss";
import { UserList } from "../../../features/UserList";
import { useQuery } from "react-query";
import { apiService } from "../api/apiUsersService";
import { User } from "../../../entities/User";
import { useCookies } from "react-cookie";
import { Loader } from "../../../shared/ui";
import { socket } from "../../../entities/User/api/socket";

export const OnlinePage = memo(({ className }: { className?: string }) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const token = cookies["jwt-cookie"]?.token;
  const username = cookies["jwt-cookie"]?.user?.username;

  const [onlineUsernames, setOnlineUsernames] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [users, setUsers] = useState<User[]>();

  const { data, isLoading, isError, error } = useQuery<User[], Error>(
    "users",
    () => apiService.getUsers(token),
    {
      enabled: !!token,
      onSuccess: (fetchedUsers) => {
        setUsersOnline(onlineUsernames, fetchedUsers);
      },
    }
  );

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      socket.emit("online-ping", username);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      socket.emit("disconnect-ping", username);
    };

    const updateOnlineUsers = (usernames: string[]) => {
      setOnlineUsernames(usernames);
      if (data) setUsersOnline(usernames, data);
      console.log(usernames + " - usernames");
      console.log(users + " - users");
    };

    const updateUserOnline = (username: string) => {
      console.log(username + " - username");
      console.log(users + " - users");
      setUsers((prevUsers) => {
        if (!prevUsers) return [];

        return prevUsers.map((user) => {
          if (user.username == username) {
            return { ...user, isOnline: true };
          }
          return user;
        });
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("online-users", updateOnlineUsers);
    socket.on("user-connected", updateUserOnline);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("online-users", updateOnlineUsers);
      socket.off("user-connected", updateUserOnline);
    };
  }, [username, data]);

  const setUsersOnline = (usernames: string[], fetchedUsers?: User[]) => {
    const usersToUpdate = fetchedUsers || users;
    if (!usersToUpdate) return;

    const updatedUsers = usersToUpdate.map((user) => ({
      ...user,
      isOnline: usernames.includes(user.username),
    }));
    console.log(updatedUsers + " - updatedUsers");
    console.log(data + " - data");
    setUsers(updatedUsers);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={`${cls.OnlinePage} ${className || ""}`}>
      <h2>Online Users</h2>
      <UserList users={users} />
    </div>
  );
});
