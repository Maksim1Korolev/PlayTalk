import { useCallback, useState } from "react";
//TODO:Relocate
import { GameModalStateProps } from "../ui/GameModals/ui/GameModals/GameModals";

export const useGameModals = () => {
  const [gameModals, setGameModals] = useState<GameModalStateProps[]>([]);

  const handleOpenGameModal = useCallback(
    ({
      opponentUsername,
      gameName,
      position,
    }: {
      opponentUsername: string;
      gameName: string;
      position?: { x: number; y: number };
    }) => {
      const newGameModalProps: GameModalStateProps = {
        opponentUsername,
        gameName,
        position,
      };

      setGameModals(prev => [...prev, newGameModalProps]);
    },
    []
  );

  const handleCloseGameModal = useCallback(
    ({
      opponentUsername,
      gameName,
    }: {
      opponentUsername: string;
      gameName: string;
    }) => {
      setGameModals(prev =>
        prev.filter(
          modal =>
            modal.opponentUsername !== opponentUsername ||
            modal.gameName !== gameName
        )
      );
    },
    []
  );

  return {
    gameModals,
    handleOpenGameModal,
    handleCloseGameModal,
  };
};
