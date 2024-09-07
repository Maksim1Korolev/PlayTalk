import { useCallback, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { User } from "@/entities/User";
import { useSockets } from "@/shared/hooks/useSockets";
import { useGameModals } from "./useGameModals";
import { useGameSessionSocket } from "./useGameSessionSocket";
import { useOnlineSockets } from "./useOnlineSockets";
import { SocketContext } from "@/shared/lib/context/SocketContext";

export const useOnlinePageSockets = () => {
  const [cookies] = useCookies();
  const { user: currentUser } = cookies["jwt-cookie"];

  const [users, setUsers] = useState<User[]>([]);
  const [inviteData, setInviteData] = useState<{
    senderUsername: string;
    gameName: string;
  } | null>(null);
  const [lastClickedPlayUser, setLastClickedPlayUser] = useState<User | null>(
    null
  );

  const { communicationSocket, gameSocket } = useSockets();
  const { setSockets } = useContext(SocketContext);

  useEffect(() => {
    setSockets({ communicationSocket, gameSocket });
  }, [communicationSocket, gameSocket]);

  const updateUsersForList = useCallback(
    (users: User[]) => {
      if (!currentUser) return;
      const otherUsers = users.filter(
        (user: User) => user._id !== currentUser._id
      );
      setUsers(otherUsers || []);
    },
    [currentUser]
  );

  const updateUserList = (username: string, updatedProps: Partial<User>) => {
    setUsers((prevUsers: User[]) => {
      if (!prevUsers) return [];

      return prevUsers.map(user => {
        if (user.username === username) {
          const { _id, username, avatarFileName, ...allowedProps } =
            updatedProps;
          return { ...user, ...allowedProps };
        }

        return user;
      });
    });
  };

  useOnlineSockets({
    sockets: { communicationSocket, gameSocket },
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
    gameSocket: gameSocket,
    onReceiveInvite,
    onGameStart,
    onGameEnd,
  });

  const handleGameRequestYesButton = (gameRequestProps: {
    opponentUsername: string;
    gameName: string;
  }) => {
    handleAcceptGame(gameRequestProps);
    setInviteData(null);
  };

  const handleGameRequestNoButton = () => {
    setInviteData(null);
  };

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

    setLastClickedPlayUser(null);
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
    handleGameRequestYesButton,
    handleGameRequestNoButton,
  };
};
