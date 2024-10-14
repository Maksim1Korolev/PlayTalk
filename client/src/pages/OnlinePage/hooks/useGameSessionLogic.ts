import { Invite, getInviteKey } from "@/entities/Game/model";
import { User } from "@/entities/User";
import { useCallback, useState } from "react";
import { useGameModals } from "./useGameModals";
import { useGameSessionSocket } from "./useGameSessionSocket";

type GameStartPayload = {
  opponentUsername: string;
  gameName: string;
};

type GameEndPayload = {
  opponentUsername: string;
  gameName: string;
  winner: string;
};

export const useGameSessionLogic = (
  users: User[],
  updateUserList: (username: string, updatedProps: Partial<User>) => void
) => {
  const [inviteMap, setInviteMap] = useState<{ [key: string]: Invite }>({});
  const [lastClickedPlayUser, setLastClickedPlayUser] = useState<User | null>(
    null
  );

  const { gameModals, handleOpenGameModal, handleCloseGameModal } =
    useGameModals();

  const getUser = (username: string): User | undefined => {
    return users.find(user => user.username === username);
  };

  const handleOpenGameSelector = useCallback((user: User) => {
    setLastClickedPlayUser(user);
  }, []);

  const onReceiveInvite = (invite: Invite) => {
    const inviteKey = getInviteKey(invite);

    setInviteMap(prevInvites => ({
      ...prevInvites,
      [inviteKey]: invite,
    }));

    updateUserList(invite.senderUsername, {
      isInviting: true,
    });
  };

  const onGameStart = ({ opponentUsername, gameName }: GameStartPayload) => {
    const user = getUser(opponentUsername); // Retrieve the user

    updateUserList(opponentUsername, {
      activeGames: [...(user?.activeGames || []), gameName],
    });

    handleOpenGameModal({ opponentUsername, gameName });
  };

  const onGameEnd = ({
    opponentUsername,
    gameName,
    winner,
  }: GameEndPayload) => {
    const user = getUser(opponentUsername);

    updateUserList(opponentUsername, {
      activeGames: (user?.activeGames || []).filter(game => game !== gameName),
    });

    handleCloseGameModal({ opponentUsername, gameName });
  };

  const { handleSendGameInvite, handleAcceptGame } = useGameSessionSocket({
    onReceiveInvite,
    onGameStart,
    onGameEnd,
  });

  const updateInvitingStatus = useCallback(
    (senderUsername: string) => {
      updateUserList(senderUsername, {
        isInviting: false,
      });
    },
    [updateUserList]
  );

  const handleGameRequestYesButton = useCallback(
    (invite: Invite) => {
      handleAcceptGame({
        opponentUsername: invite.senderUsername,
        gameName: invite.gameName,
      });
      const inviteKey = getInviteKey(invite);
      setInviteMap(prevInvites => {
        const { [inviteKey]: removed, ...remainingInvites } = prevInvites;
        return remainingInvites;
      });
      updateInvitingStatus(invite.senderUsername);
    },
    [handleAcceptGame, updateInvitingStatus]
  );

  const handleGameRequestNoButton = useCallback(
    (invite: Invite) => {
      const inviteKey = getInviteKey({
        senderUsername: invite.senderUsername,
        gameName: invite.gameName,
      });
      setInviteMap(prevInvites => {
        const { [inviteKey]: removed, ...remainingInvites } = prevInvites;
        return remainingInvites;
      });
      updateInvitingStatus(invite.senderUsername);
    },
    [updateInvitingStatus]
  );

  const handleGameClicked = ({
    opponentUsername,
    gameName,
    isActive,
    isInviting,
  }: {
    opponentUsername: string;
    gameName: string;
    isActive: boolean;
    isInviting: boolean;
  }) => {
    if (isInviting) {
      const invite: Invite = { senderUsername: opponentUsername, gameName };
      handleGameRequestYesButton(invite);
    } else if (isActive) {
      handleOpenGameModal({ opponentUsername, gameName });
    } else {
      handleSendGameInvite({ receiverUsername: opponentUsername, gameName });
    }
  };

  return {
    lastClickedPlayUser,
    invites: Object.values(inviteMap),
    gameModals,
    handleGameClicked,
    handleGameRequestYesButton,
    handleGameRequestNoButton,
    handleOpenGameSelector,
    onGameModalClose: handleCloseGameModal,
  };
};
