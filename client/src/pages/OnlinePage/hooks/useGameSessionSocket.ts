import { useCallback, useContext, useEffect } from "react";

import { SocketContext } from "@/shared/lib/context/SocketContext";

import { GameData, isGameName } from "@/entities/game/Game";
import { Invite } from "@/entities/game/Invite";

export const useGameSessionSocket = ({
  onReceiveInvite,
  onGameStart,
  onGameEnd,
}: {
  onReceiveInvite: ({ invite }: { invite: Invite }) => void;
  onGameStart: ({ gameData }: { gameData: GameData }) => void;
  onGameEnd: ({
    gameData,
    winner,
  }: {
    gameData: GameData;
    winner: string;
  }) => void;
}) => {
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

  const handleAcceptGame = useCallback(
    ({
      opponentUsername,
      gameName,
    }: {
      opponentUsername: string;
      gameName: string;
    }) => {
      if (gameSocket) {
        console.log(
          `Accepting game invite with opponent ${opponentUsername} for game ${gameName}`
        );
        gameSocket.emit("accept-game", { opponentUsername, gameName });
      }
    },
    [gameSocket]
  );

  useEffect(() => {
    if (gameSocket) {
      const handleReceiveInvite = ({
        senderUsername,
        gameName,
      }: {
        senderUsername: string;
        gameName: string;
      }) => {
        console.log(
          `Game request received from ${senderUsername} for game ${gameName}`
        );
        onReceiveInvite({ invite: { senderUsername, gameName } });
      };

      const handleStartGame = ({
        opponentUsername,
        gameName,
      }: {
        opponentUsername: string;
        gameName: string;
      }) => {
        console.log(
          `Game started with opponent ${opponentUsername} for game ${gameName}`
        );
        if (!isGameName(gameName)) {
          //TODO: log on incorrect
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
        gameName: string;
        winner: string;
      }) => {
        console.log(
          `Game ended with opponent ${opponentUsername} for game ${gameName}. Winner: ${winner}`
        );
        if (!isGameName(gameName)) {
          //TODO: log on incorrect
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
