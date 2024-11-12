import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/lib";

import { GameData, GameName } from "@/entities/game/Game";
import { Invite, inviteActions } from "@/entities/game/Invite";
import { getUsers, User, userActions } from "@/entities/User";
import { useGameModals } from "@/widgets/GameModals";
import { generateModalId } from "@/widgets/GameModals/hooks/useGameModals";

import { useGameSessionSocket } from "./useGameSessionSocket";

type GameStartPayload = {
  gameData: GameData;
};

type GameEndPayload = {
  gameData: GameData;
  winner: string;
};

// Define GameStatus type
type GameStatus = {
  hasInvitation?: boolean;
  isActive?: boolean;
};

export const useGameSessionLogic = () => {
  const users = useAppSelector(getUsers);
  const dispatch = useAppDispatch();

  const { gameModals, handleOpenGameModal, handleCloseGameModal } =
    useGameModals();

  const getUser = (username: string): User | undefined => {
    return users[username];
  };

  //TODO:Move
  const updateGameStatusMap = useCallback(
    (
      username: string,
      gameName: GameName,
      statusUpdate: Partial<GameStatus>
    ) => {
      const user = users[username];

      const currentGameStatusMap = (user?.gameStatusMap ?? {}) as Record<
        GameName,
        GameStatus
      >;

      const currentGameStatus = currentGameStatusMap[gameName] ?? {};

      const updatedGameStatusMap: Record<GameName, GameStatus> = {
        ...currentGameStatusMap,
        [gameName]: {
          ...currentGameStatus,
          ...statusUpdate,
        },
      };

      dispatch(
        userActions.updateUser({
          username,
          updatedProps: {
            gameStatusMap: updatedGameStatusMap,
          },
        })
      );
    },
    [dispatch, users]
  );

  const onReceiveInvite = ({ invite }: { invite: Invite }) => {
    dispatch(inviteActions.receiveInvite(invite));

    updateGameStatusMap(invite.senderUsername, invite.gameName, {
      hasInvitation: true,
    });
  };

  const onGameStart = ({ gameData }: GameStartPayload) => {
    updateGameStatusMap(gameData.opponentUsername, gameData.gameName, {
      isActive: true,
    });

    handleOpenGameModal({ modalData: gameData });
  };

  const onGameEnd = ({ gameData, winner }: GameEndPayload) => {
    updateGameStatusMap(gameData.opponentUsername, gameData.gameName, {
      isActive: false,
    });

    handleCloseGameModal({ modalId: generateModalId(gameData) });
  };

  const { handleSendGameInvite, handleAcceptGame } = useGameSessionSocket({
    onReceiveInvite,
    onGameStart,
    onGameEnd,
  });

  const handleAcceptGameInvite = useCallback(
    (invite: Invite) => {
      handleAcceptGame({
        opponentUsername: invite.senderUsername,
        gameName: invite.gameName,
      });

      updateGameStatusMap(invite.senderUsername, invite.gameName, {
        hasInvitation: false,
      });
    },
    [handleAcceptGame, updateGameStatusMap]
  );

  //TODO: Add removeCurrentInvite logic
  const handleGameClicked = (gameData: GameData) => {
    const user = getUser(gameData.opponentUsername);
    const gameStatus = user?.gameStatusMap?.[gameData.gameName] || {};
    const isActive = gameStatus.isActive || false;
    const hasInvitation = gameStatus.hasInvitation || false;

    const invite: Invite = {
      senderUsername: gameData.opponentUsername,
      gameName: gameData.gameName,
    };

    if (hasInvitation) {
      handleAcceptGameInvite(invite);
    } else if (isActive) {
      handleOpenGameModal({ modalData: gameData });
    } else {
      handleSendGameInvite({
        receiverUsername: gameData.opponentUsername,
        gameName: gameData.gameName,
      });
    }
  };

  return {
    gameModals,
    handleGameClicked,
    handleCloseGameModal,
  };
};
