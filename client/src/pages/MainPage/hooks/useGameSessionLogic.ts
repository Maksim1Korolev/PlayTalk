import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/lib";

import { GameData } from "@/entities/game/Game";
import { updateGameStatusMap } from "@/entities/game/GameStatus";
import { Invite, inviteActions } from "@/entities/game/Invite";
import { getUsers, User } from "@/entities/User";
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

export const useGameSessionLogic = () => {
  const users = useAppSelector(getUsers);
  const dispatch = useAppDispatch();

  const { gameModals, handleOpenGameModal, handleCloseGameModal } =
    useGameModals();

  const getUser = (username: string): User | undefined => {
    return users[username];
  };

  const onReceiveInvite = ({ invite }: { invite: Invite }) => {
    dispatch(inviteActions.receiveInvite(invite));

    dispatch(
      updateGameStatusMap({
        username: invite.senderUsername,
        gameName: invite.gameName,
        statusUpdate: {
          hasInvitation: true,
        },
      })
    );
  };

  const onGameStart = ({ gameData }: GameStartPayload) => {
    dispatch(
      updateGameStatusMap({
        username: gameData.opponentUsername,
        gameName: gameData.gameName,
        statusUpdate: {
          isActive: true,
        },
      })
    );

    handleOpenGameModal({ modalData: gameData });
  };

  const onGameEnd = ({ gameData, winner }: GameEndPayload) => {
    dispatch(
      updateGameStatusMap({
        username: gameData.opponentUsername,
        gameName: gameData.gameName,
        statusUpdate: {
          isActive: false,
        },
      })
    );

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

      dispatch(
        updateGameStatusMap({
          username: invite.senderUsername,
          gameName: invite.gameName,
          statusUpdate: {
            hasInvitation: false,
          },
        })
      );
    },
    [handleAcceptGame, updateGameStatusMap]
  );

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
