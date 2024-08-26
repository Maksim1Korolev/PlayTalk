import { User } from "@/entities/User";
import { useCallback, useState } from "react";
import { useOnlineSocket } from "./useOnlineSocket";
import { useCookies } from "react-cookie";
import { useGameSessionSocket } from "./useGameSessionSocket";
import { useGameModals } from "./useGameModals";

export const useOnlinePageSockets = () => {
  const [cookies] = useCookies();
  const { user: currentUser } = cookies["jwt-cookie"];
  const [upToDateUsers, setUpToDateUsers] = useState<User[]>();

  const [inviteData, setInviteData] = useState<{
    senderUsername: string;
    gameName: string;
  } | null>(null);
  const [lastClickedPlayUser, setLastClickedPlayUser] = useState<User | null>(
    null
  );

  const updateUsers = useCallback(
    (users: User[]) => {
      if (!currentUser) return;
      const otherUsers = users.filter(
        (user: User) => user._id !== currentUser._id
      );
      setUpToDateUsers(otherUsers);
    },
    [currentUser]
  );

  useOnlineSocket({
    upToDateUsers,
    setUpToDateUsers,
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
    return upToDateUsers?.find(user => user.username === username);
  };

  const onGameStart = ({
    opponentUsername,
    gameName,
  }: {
    opponentUsername: string;
    gameName: string;
  }) => {
    const user = getUser(opponentUsername);
    console.log("USER onGameStart:", user);
  
    if (user) {
      user.activeGames = [...user.activeGames, gameName]; // Add gameName to the user's activeGames
    }
  
    setUpToDateUsers((prevUsers) => {
      if (!prevUsers) return [];
      if (user) {
        const userIndex = prevUsers.findIndex((u) => u.username === user.username);
        if (userIndex !== -1) {
          const updatedUsers = [...prevUsers];
          updatedUsers[userIndex] = user;
          return updatedUsers;
        } else {
          return [...prevUsers, user];
        }
      }
      return prevUsers;
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
    const user = getUser(opponentUsername);
    console.log("USER onGameEnd:");
    console.log(user);

    if (user) {
      user.activeGames = user.activeGames.filter(game => game !== gameName);
    }
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
    upToDateUsers,
    inviteData,
    lastClickedPlayUser,
    gameModals,
    updateUsers,
    handleOpenGameSelector,
    handleGameClicked,
    handleAcceptGame,
  };
};
