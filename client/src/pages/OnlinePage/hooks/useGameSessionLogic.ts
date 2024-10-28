import { useCallback, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/lib";

import { GameData, getInviteKey, Invite } from "@/entities/Game";
import { getUsers, User, userActions } from "@/entities/User";

import { useGameModals } from "./useGameModals";
import { useGameSessionSocket } from "./useGameSessionSocket";

type GameStartPayload = {
  gameData: GameData;
};

type GameEndPayload = {
  gameData: GameData;
  winner: string;
};

export const useGameSessionLogic = () => {
  const users = useAppSelector(getUsers);
  const dispatch = useAppDispatch();

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

  const onReceiveInvite = ({ invite }: { invite: Invite }) => {
    const inviteKey = getInviteKey(invite);

    setInviteMap(prevInvites => ({
      ...prevInvites,
      [inviteKey]: invite,
    }));

    dispatch(
      userActions.updateUser({
        username: invite.senderUsername,
        updatedProps: {
          isInviting: true,
        },
      })
    );
  };

  const onGameStart = ({ gameData }: GameStartPayload) => {
    const user = getUser(gameData.opponentUsername);

    dispatch(
      userActions.updateUser({
        username: gameData.opponentUsername,
        updatedProps: {
          activeGames: [...(user?.activeGames || []), gameData.gameName],
        },
      })
    );

    handleOpenGameModal({ gameData });
  };

  const onGameEnd = ({ gameData, winner }: GameEndPayload) => {
    const user = getUser(gameData.opponentUsername);

    dispatch(
      userActions.updateUser({
        username: gameData.opponentUsername,
        updatedProps: {
          activeGames: (user?.activeGames || []).filter(
            game => game !== gameData.gameName
          ),
        },
      })
    );

    handleCloseGameModal({ gameData });
  };

  const { handleSendGameInvite, handleAcceptGame } = useGameSessionSocket({
    onReceiveInvite,
    onGameStart,
    onGameEnd,
  });

  const updateInvitingStatus = useCallback(
    (senderUsername: string) => {
      dispatch(
        userActions.updateUser({
          username: senderUsername,
          updatedProps: {
            isInviting: false,
          },
        })
      );
    },
    [dispatch]
  );

  const handleAcceptGameInvite = useCallback(
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

  const handleRejectGameInvite = useCallback(
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
    gameData,
    isActive,
    isInviting,
  }: {
    gameData: GameData;
    isActive: boolean;
    isInviting: boolean;
  }) => {
    if (isInviting) {
      const invite: Invite = {
        senderUsername: gameData.opponentUsername,
        gameName: gameData.gameName,
      };
      handleAcceptGameInvite(invite);
    } else if (isActive) {
      handleOpenGameModal({ gameData });
    } else {
      handleSendGameInvite({
        receiverUsername: gameData.opponentUsername,
        gameName: gameData.gameName,
      });
    }
  };

  return {
    lastClickedPlayUser,
    invites: Object.values(inviteMap),
    gameModals,
    handleGameClicked,
    handleGameRequestYesButton: handleAcceptGameInvite,
    handleGameRequestNoButton: handleRejectGameInvite,
    handleOpenGameSelector,
    handleCloseGameModal,
  };
};
