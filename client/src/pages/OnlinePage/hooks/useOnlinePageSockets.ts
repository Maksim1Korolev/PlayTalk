import { useCallback, useContext } from "react";
import { useCookies } from "react-cookie";

import { User } from "@/entities/User";
import { useSockets } from "@/shared/hooks/useSockets";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { useGameSessionLogic } from "./useGameSessionLogic";
import { useOnlineSockets } from "./useOnlineSockets";

export const useOnlinePageSockets = () => {
  const [cookies] = useCookies();
  const { user: currentUser } = cookies["jwt-cookie"];
  const { users, setUsers } = useContext(UsersContext);

  const updateUserList = useCallback(
    (username: string, updatedProps: Partial<User>) => {
      setUsers((prevUsers: User[]) => {
        if (!prevUsers) return [];

        return prevUsers.map(user => {
          if (user.username === username) {
            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              _id,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              username,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              avatarFileName,
              ...allowedProps
            }: Partial<User> = updatedProps;
            return { ...user, ...allowedProps };
          }

          return user;
        });
      });
    },
    [setUsers]
  );

  const {
    lastClickedPlayUser,
    invites,
    gameModals,
    handleGameClicked,
    handleGameRequestYesButton,
    handleGameRequestNoButton,
    handleOpenGameSelector,
    onGameModalClose,
  } = useGameSessionLogic(users, updateUserList);

  useSockets();

  const updateUsersForList = useCallback(
    (userList: User[]) => {
      if (!currentUser) return;

      const otherUsers = userList.filter(
        (user: User) => user._id !== currentUser._id
      );

      setUsers(otherUsers || []);
    },
    [currentUser, setUsers]
  );

  useOnlineSockets({
    updateUserList,
  });

  return {
    users,
    invites,
    lastClickedPlayUser,
    gameModals,
    onGameModalClose,
    updateUsers: updateUsersForList,
    handleOpenGameSelector,
    handleGameClicked,
    handleGameRequestYesButton,
    handleGameRequestNoButton,
  };
};
