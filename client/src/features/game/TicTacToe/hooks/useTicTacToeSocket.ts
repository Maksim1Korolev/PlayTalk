import { gameSocket } from "@/shared/api/sockets";
import { useCallback, useEffect } from "react";

const gameName = "tic-tac-toe";

const MAKE_MOVE_EVENT = `${gameName}-make-move`;
const MOVE_MADE_EVENT = `${gameName}-move-made`;
const SURRENDER_EVENT = `${gameName}-surrender`;

export const useTicTacToeSocket = ({
  onMoveMade,
}: {
  onMoveMade: ({
    interactingUsername,
    interactingIndex,
  }: {
    interactingUsername: string;
    interactingIndex: number;
  }) => void;
}) => {
  const handleMakeMove = useCallback(
    ({
      opponentUsername,
      interactingIndex,
    }: {
      opponentUsername: string;
      interactingIndex: number;
    }) => {
      console.log(
        `Making move in ${gameName} game against ${opponentUsername}`
      );
      gameSocket.emit(MAKE_MOVE_EVENT, { opponentUsername, interactingIndex });
    },
    []
  );

  const handleSurrender = useCallback(
    ({ opponentUsername }: { opponentUsername: string }) => {
      console.log(
        `Surrendering in ${gameName} game against ${opponentUsername}`
      );
      gameSocket.emit(SURRENDER_EVENT, { opponentUsername });
    },
    []
  );

  useEffect(() => {
    const handleMoveMade = ({
      interactingUsername,
      interactingIndex,
    }: {
      interactingUsername: string;
      interactingIndex: number;
    }) => {
      console.log(
        `Move made in ${gameName} game by ${interactingUsername} at index ${interactingIndex}`
      );
      onMoveMade({ interactingUsername, interactingIndex });
    };

    gameSocket.on(MOVE_MADE_EVENT, handleMoveMade);

    return () => {
      gameSocket.off(MOVE_MADE_EVENT, handleMoveMade);
    };
  }, [onMoveMade]);

  return {
    handleMakeMove,
    handleSurrender,
  };
};
