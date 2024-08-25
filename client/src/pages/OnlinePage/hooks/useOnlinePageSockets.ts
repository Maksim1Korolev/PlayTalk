import { User } from "@/entities/User";
import { useCallback, useState } from "react";
import { useOnlineSocket } from "./useOnlineSocket";
import { useCookies } from "react-cookie";
import { useGameSessionSocket } from "./useGameSessionSocket";
import { useGameModals } from "./useGameModals";

//TODO: Separate users update, so that if game Server crashes, online will work
export const useOnlinePageSockets = () => {
  const [cookies] = useCookies();
  const { user: currentUser } = cookies["jwt-cookie"];
  const [upToDateUsers, setUpToDateUsers] = useState<User[]>();

  const [inviteData, setInviteData] = useState<{
    senderUsername: string;
    gameName: string;
  } | null>(null);
  const [lastClickedPlayData, setLastClickedPlayData] = useState<{
    opponentUsername: string;
    activeGames: string[];
  } | null>(null);

  const updateUsers = useCallback(
    (users: User[]) => {
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

  const handleOpenGameSelector = useCallback(
    ({
      opponentUsername,
      activeGames,
    }: {
      opponentUsername: string;
      activeGames: string[];
    }) => {
      setLastClickedPlayData({ opponentUsername, activeGames });
    },
    []
  );

  const onReceiveInvite = ({
    senderUsername,
    gameName,
  }: {
    senderUsername: string;
    gameName: string;
  }) => {
    setInviteData({ senderUsername, gameName });
  };

  const { gameModals, handleOpenGameModal, handleCloseGameModal } =
    useGameModals();

  const { handleSendGameInvite, handleAcceptGame } = useGameSessionSocket({
    onReceiveInvite,
    onGameStart: handleOpenGameModal,
    onGameEnd: handleCloseGameModal,
  });

  return {
    upToDateUsers,
    inviteData,
    lastClickedPlayData,
    gameModals,
    updateUsers,
    handleOpenGameSelector,
    handleSendGameInvite,
    handleAcceptGame,
  };
};
