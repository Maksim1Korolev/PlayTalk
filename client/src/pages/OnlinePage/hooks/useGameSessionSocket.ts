import { gameSocket } from "@/shared/api/sockets";
import { useCallback, useEffect } from "react";

export const useGameSessionSocket = ({
  onReceiveInvite,
}: {
  onReceiveInvite: ({
    senderUsername,
    game,
  }: {
    senderUsername: string;
    game: string;
  }) => void;
}) => {
  //    ( {
  //         onGameStart,
  //         onGameEnd,
  //       }: {
  //         onGameStart: ({
  //           opponentUsername,
  //           game,
  //         }: {
  //           opponentUsername: string;
  //           game: string;
  //         }) => void;
  //         onGameEnd: ({
  //           opponentUsername,
  //           game,
  //           winner,
  //         }: {
  //           opponentUsername: string;
  //           game: string;
  //           winner: string;
  //         }) => void;
  //       })

  const handleSendGameInvite = useCallback(
    ({
      receiverUsername,
      game,
    }: {
      receiverUsername: string;
      game: string;
    }) => {
      console.log(`Sending ${game} game invite to: ${receiverUsername}`);
      gameSocket.emit("send-game-invite", { receiverUsername, game });
    },
    []
  );

  const handleAcceptGame = useCallback(
    ({
      opponentUsername,
      game,
    }: {
      opponentUsername: string;
      game: string;
    }) => {
      console.log(
        `Accepting game invite with opponent ${opponentUsername} for game ${game}`
      );
      gameSocket.emit("accept-game", { opponentUsername, game });
    },
    []
  );

  useEffect(() => {
    const handleReceiveInvite = ({
      senderUsername,
      game,
    }: {
      senderUsername: string;
      game: string;
    }) => {
      console.log(
        `Game request received from ${senderUsername} for game ${game}`
      );
      onReceiveInvite({ senderUsername, game });
    };

    const handleStartGame = ({
      opponentUsername,
      game,
    }: {
      opponentUsername: string;
      game: string;
    }) => {
      console.log(
        `Game started with opponent ${opponentUsername} for game ${game}`
      );
      //  onGameStart({ opponentUsername, game });
    };

    const handleEndGame = ({
      opponentUsername,
      game,
      winner,
    }: {
      opponentUsername: string;
      game: string;
      winner: string;
    }) => {
      console.log(
        `Game ended with opponent ${opponentUsername} for game ${game}. Winner: ${winner}`
      );
      //   onGameEnd({ opponentUsername, game, winner });
    };

    gameSocket.on("receive-game-invite", handleReceiveInvite);
    gameSocket.on("start-game", handleStartGame);
    gameSocket.on("end-game", handleEndGame);

    return () => {
      gameSocket.off("start-game", handleStartGame);
      gameSocket.off("end-game", handleEndGame);
    };
  }, [onReceiveInvite]); //[onGameStart, onGameEnd]

  return {
    handleSendGameInvite,
    handleAcceptGame,
  };
};

export const useReceiveInvite = (
  receiveInvite: ({ senderUsername }: { senderUsername: string }) => void
) => {
  useEffect(() => {
    gameSocket.on("receive-game-invite", receiveInvite);
    return () => {
      gameSocket.off("receive-game-invite", receiveInvite);
    };
  }, [receiveInvite]);
};
