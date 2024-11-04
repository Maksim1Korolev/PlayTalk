import { useCallback } from "react"

import { useAppDispatch, useAppSelector } from "@/shared/lib"

import { GameData } from "@/entities/game/Game"
import { getInviteKey, Invite, inviteActions } from "@/entities/game/Invite"
import { getUsers, User, userActions } from "@/entities/User"
import { useGameModals } from "@/widgets/GameModals"

import { generateModalId } from '@/widgets/GameModals/hooks/useGameModals'
import { useGameSessionSocket } from "./useGameSessionSocket"

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
      userActions.updateUser({
        username: invite.senderUsername,
        updatedProps: { isInviting: true },
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


    handleOpenGameModal({ modalData: gameData });
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

      dispatch(inviteActions.removeInvite(getInviteKey(invite)));

      dispatch(
        userActions.updateUser({
          username: invite.senderUsername,
          updatedProps: { isInviting: false },
        })
      );
    },
    [dispatch, handleAcceptGame]
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
		
    const invite: Invite = {
      senderUsername: gameData.opponentUsername,
      gameName: gameData.gameName,
    };

    if (isInviting) {
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
