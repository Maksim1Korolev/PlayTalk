import { useCallback, useContext, useEffect } from "react";

import { useAppDispatch } from "@/shared/lib";
import { SocketContext } from "@/shared/lib/context/SocketContext";

import {
  GameData,
  GameModalData,
  GameName,
  isGameName,
} from "@/entities/game/Game";
import { acceptGameInvite, Invite } from "@/entities/game/Invite";

export const useGameSessionSocket = ({
  onReceiveInvite,
  onGameStart,
  onGameEnd,
}: {
  onReceiveInvite: ({ invite }: { invite: Invite }) => void;
  onGameStart: ({ gameData }: { gameData: GameModalData }) => void;
  onGameEnd: ({
    gameData,
    winner,
  }: {
    gameData: GameData;
    winner: string;
  }) => void;
}) => {
  const dispatch = useAppDispatch();

  const { sockets } = useContext(SocketContext);
  const { gameSocket } = sockets;

  const handleSendGameInvite = useCallback(
    ({
      receiverUsername,
      gameName,
    }: {
      receiverUsername: string;
      gameName: string;
    }) => {
      if (gameSocket) {
        console.log(`Sending ${gameName} game invite to: ${receiverUsername}`);
        gameSocket.emit("send-game-invite", { receiverUsername, gameName });
      }
    },
    [gameSocket]
  );

  //TODO:Move
  const handleAcceptGame = useCallback(
    ({ opponentUsername, gameName }: GameData) => {
      if (gameSocket) {
        console.log(
          `Accepting game invite with opponent ${opponentUsername} for game ${gameName}`
        );

        dispatch(
          acceptGameInvite({
            gameSocket,
            invite: {
              senderUsername: opponentUsername,
              gameName,
            },
          })
        );
      }
    },
    [gameSocket]
  );

  useEffect(() => {
    if (gameSocket) {
      const handleReceiveInvite = ({ senderUsername, gameName }: Invite) => {
        console.log(
          `Game request received from ${senderUsername} for game ${gameName}`
        );
        onReceiveInvite({ invite: { senderUsername, gameName } });
      };

      const handleStartGame = ({ opponentUsername, gameName }: GameData) => {
        console.log(
          `Game started with opponent ${opponentUsername} for game ${gameName}`
        );

        if (!isGameName(gameName)) {
          console.log(
            `A game named ${gameName} doesn't exist, can't start this game`
          );
          return;
        }
        onGameStart({ gameData: { opponentUsername, gameName } });
      };

      const handleEndGame = ({
        opponentUsername,
        gameName,
        winner,
      }: {
        opponentUsername: string;
        gameName: GameName;
        winner: string;
      }) => {
        console.log(
          `Game ended with opponent ${opponentUsername} for game ${gameName}. Winner: ${winner}`
        );
        if (!isGameName(gameName)) {
          console.log(
            `A game named ${gameName} doesn't exist, can't end this game`
          );
          return;
        }
        onGameEnd({ gameData: { opponentUsername, gameName }, winner });
      };

      gameSocket.on("receive-game-invite", handleReceiveInvite);
      gameSocket.on("start-game", handleStartGame);
      gameSocket.on("end-game", handleEndGame);

      return () => {
        gameSocket.off("receive-game-invite", handleReceiveInvite);
        gameSocket.off("start-game", handleStartGame);
        gameSocket.off("end-game", handleEndGame);
      };
    }
  }, [gameSocket]);

  return {
    handleSendGameInvite,
    handleAcceptGame,
  };
};
