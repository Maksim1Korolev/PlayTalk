import { User } from "@/entities/User";
import { onlineSocket } from "@/shared/api/sockets";
import { useCallback, useEffect } from "react";
import { useCookies } from "react-cookie";

export const useOnlineSocket = ({
  upToDateUsers,
  setUpToDateUsers,
}: {
  upToDateUsers?: User[];
  setUpToDateUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>;
}) => {
  //  const [onlineUsernames, setOnlineUsernames] = useState<string[]>([]);

  const [cookies] = useCookies();
  const { user }: { user: User } = cookies["jwt-cookie"];

  const setUsersOnline = useCallback(
    (usernames: string[]) => {
      const usersToUpdate = upToDateUsers;
      if (!usersToUpdate) return upToDateUsers;

      const updatedUsers = usersToUpdate.map((user: User) => ({
        ...user,
        isOnline: usernames.includes(user.username),
      }));

      setUpToDateUsers(updatedUsers);

      return updatedUsers;
    },
    [setUpToDateUsers, upToDateUsers]
  );

  useEffect(() => {
    const onConnect = () => {
      onlineSocket.emit("online-ping", user.username);
    };

    const updateOnlineUsers = (usernames: string[]) => {
      //setOnlineUsernames(usernames);

      setUsersOnline(usernames);
    };

    const updateUserOnline = (username: string, isOnline: boolean) => {
      //   setOnlineUsernames((prev) => {
      //     if (isOnline) {
      //       return prev.includes(username) ? prev : [...prev, username];
      //     } else {
      //       return prev.filter((u) => u !== username);
      //     }
      //   });
      setUpToDateUsers(prevUsers => {
        if (!prevUsers) return [];

        prevUsers.reduce;

        return prevUsers?.map(user => {
          if (user.username == username) {
            return { ...user, isOnline };
          }
          return user;
        });
      });
    };

    const updateUserList = (username: string, updatedProps: Partial<User>) => {
      setUpToDateUsers(prevUsers => {
        if (!prevUsers) return [];

        return prevUsers.map(user => {
          if (user.username == username) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _id, username, avatarPath, ...allowedProps } = updatedProps;
            return { ...user, ...allowedProps };
          }

          return user;
        });
      });
    };

    //Chat Logic
    const unreadMessageCountChanged = (
      username: string,
      unreadMessageCount: number
    ) => {
      updateUserList(username, { unreadMessageCount });
    };

    /////////////////////////////////////////////////////
    onlineSocket.on("connect", onConnect);
    //TODO:Remove???
    onlineSocket.on("user-connection", updateUserOnline);

    /////////////////////////////////////////////////////
    onlineSocket.on("unread-count-messages", unreadMessageCountChanged);

    return () => {
      onlineSocket.off("connect", onConnect);
      onlineSocket.off("user-connection", updateUserOnline);
      onlineSocket.close();
    };
  }, []);
};
