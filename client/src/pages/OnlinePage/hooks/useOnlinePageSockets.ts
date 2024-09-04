import { User } from "@/entities/User";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { useCallback, useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { useGameModals } from "./useGameModals";
import { useGameSessionSocket } from "./useGameSessionSocket";
import { useOnlineSocket } from "./useOnlineSocket";

//Rename to useHomePageHooks?
export const useOnlinePageSockets = () => {
  const [cookies] = useCookies();
  const { user: currentUser } = cookies["jwt-cookie"];
  const { users, setUsers } = useContext(UsersContext);

  const [inviteData, setInviteData] = useState<{
    senderUsername: string;
    gameName: string;
  } | null>(null);
  const [lastClickedPlayUser, setLastClickedPlayUser] = useState<User | null>(
    null
  );

  const updateUsersForList = useCallback(
    (users: User[]) => {
      if (!currentUser) return;
      const otherUsers = users.filter(
        (user: User) => user._id !== currentUser._id
      );
      setUsers(otherUsers || []);
    },
    [currentUser, setUsers]
  );

  const updateUserList = (username: string, updatedProps: Partial<User>) => {
    setUsers((prevUsers: User[]) => {
      if (!prevUsers) return [];

      return prevUsers.map(user => {
        if (user.username === username) {
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

  useOnlineSocket({
    updateUserList,
  });

  const handleOpenGameSelector = useCallback((user: User) => {
    setLastClickedPlayUser(user);
  }, []);

  const onReceiveInvite = ({
    senderUsername,
    gameName,
  }: {
    senderUsername: string;
    gameName: string;
  }) => {
    setInviteData({ senderUsername, gameName });
  };

  const getUser = (username: string): User | undefined => {
    return users?.find(user => user.username === username);
  };

  const onGameStart = ({
    opponentUsername,
    gameName,
  }: {
    opponentUsername: string;
    gameName: string;
  }) => {
    updateUserList(opponentUsername, {
      activeGames: [
        ...(getUser(opponentUsername)?.activeGames || []),
        gameName,
      ],
    });

    handleOpenGameModal({ opponentUsername, gameName });
  };

  const onGameEnd = ({
    opponentUsername,
    gameName,
    winner,
  }: {
    opponentUsername: string;
    gameName: string;
    winner: string;
  }) => {
    updateUserList(opponentUsername, {
      activeGames: (getUser(opponentUsername)?.activeGames || []).filter(
        game => game !== gameName
      ),
    });

    handleCloseGameModal({ opponentUsername, gameName });
  };

  const { gameModals, handleOpenGameModal, handleCloseGameModal } =
    useGameModals();

  const { handleSendGameInvite, handleAcceptGame } = useGameSessionSocket({
    onReceiveInvite,
    onGameStart,
    onGameEnd,
  });

  const handleGameClicked = ({
    opponentUsername,
    gameName,
    isActive,
  }: {
    opponentUsername: string;
    gameName: string;
    isActive: boolean;
  }) => {
    isActive
      ? handleOpenGameModal({ opponentUsername, gameName })
      : handleSendGameInvite({ receiverUsername: opponentUsername, gameName });
  };

  return {
    users,
    inviteData,
    lastClickedPlayUser,
    gameModals,
    onGameModalClose: handleCloseGameModal,
    updateUsers: updateUsersForList,
    handleOpenGameSelector,
    handleGameClicked,
    handleAcceptGame,
  };
};
