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
  const [lastClickedPlayUser, setLastClickedPlayUser] = useState<User | null>(
    null
  );

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

  const onGameStart = ({
    opponentUsername,
    gameName,
  }: {
    opponentUsername: string;
    gameName: string;
  }) => {
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
    // if (user.activeGames) {
    //   user.activeGames = user.activeGames.filter(game => game !== gameName);
    // }
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
      ? onGameStart({ opponentUsername, gameName })
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
    onGameEnd,
    onGameStart, // Export onGameStart if you need to use it outside this hook
  };
};
