import { gameSocket } from "@/shared/api/sockets";
import { useCallback, useEffect } from "react";

export const useGameSessionSocket = ({
  onReceiveInvite,
}: {
  onReceiveInvite: ({
    senderUsername,
    gameName,
  }: {
    senderUsername: string;
    gameName: string;
  }) => void;
}) => {
  //    ( {
  //         onGameStart,
  //         onGameEnd,
  //       }: {
  //         onGameStart: ({
  //           opponentUsername,
  //           gameName,
  //         }: {
  //           opponentUsername: string;
  //           gameName: string;
  //         }) => void;
  //         onGameEnd: ({
  //           opponentUsername,
  //           gameName,
  //           winner,
  //         }: {
  //           opponentUsername: string;
  //           gameName: string;
  //           winner: string;
  //         }) => void;
  //       })

  const handleSendGameInvite = useCallback(
    ({
      receiverUsername,
      gameName,
    }: {
      receiverUsername: string;
      gameName: string;
    }) => {
      console.log(`Sending ${gameName} game invite to: ${receiverUsername}`);
      gameSocket.emit("send-game-invite", { receiverUsername, gameName });
    },
    []
  );

  const handleAcceptGame = useCallback(
    ({
      opponentUsername,
      gameName: gameName,
    }: {
      opponentUsername: string;
      gameName: string;
    }) => {
      console.log(
        `Accepting game invite with opponent ${opponentUsername} for game ${gameName}`
      );
      gameSocket.emit("accept-game", { opponentUsername, gameName });
    },
    []
  );

  useEffect(() => {
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
      onReceiveInvite({ senderUsername, gameName });
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
      //  onGameStart({ opponentUsername, gameName });
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
      //   onGameEnd({ opponentUsername, gameName, winner });
    };

    gameSocket.on("receive-game-invite", handleReceiveInvite);
    gameSocket.on("start-game", handleStartGame);
    gameSocket.on("end-game", handleEndGame);

    return () => {
      gameSocket.off("receive-game-invite", handleReceiveInvite);
      gameSocket.off("start-game", handleStartGame);
      gameSocket.off("end-game", handleEndGame);
    };
  }, [onReceiveInvite]); //[onGameStart, onGameEnd]

  return {
    handleSendGameInvite,
    handleAcceptGame,
  };
};
