import { User } from "@/entities/User";
import { onlineSocket } from "@/shared/api/sockets";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export const useOnlineSocket = ({
  setUpToDateUsers,
}: {
  upToDateUsers?: User[];
  setUpToDateUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>;
}) => {
  //  const [onlineUsernames, setOnlineUsernames] = useState<string[]>([]);

  const [cookies] = useCookies();
  const { user }: { user: User } = cookies["jwt-cookie"];

  useEffect(() => {
    const onConnect = () => {
      onlineSocket.emit("online-ping", user.username);
    };

    const updateUserOnline = (username: string, isOnline: boolean) => {
      updateUserList(username, { isOnline });
    };

    const updateUserList = (username: string, updatedProps: Partial<User>) => {
      setUpToDateUsers(prevUsers => {
        if (!prevUsers) return [];

        return prevUsers.map(user => {
          if (user.username == username) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _id, username, avatarFileName, ...allowedProps } =
              updatedProps;
            console.log(allowedProps);

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
    onlineSocket.on("user-connection", updateUserOnline);
    /////////////////////////////////////////////////////
    onlineSocket.on("unread-count-messages", unreadMessageCountChanged);

    return () => {
      onlineSocket.off("connect", onConnect);
      onlineSocket.off("user-connection", updateUserOnline);
      onlineSocket.off("unread-count-messages", unreadMessageCountChanged);
      onlineSocket.close();
    };
  }, []);
};
