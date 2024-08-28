import { useCallback, useState } from "react";
import { GameModalStateProps } from "@/entities/Game/model/types/gameModalStateProps";

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
      const isAlreadyOpen = gameModals.some(
        modal =>
          modal.opponentUsername === opponentUsername &&
          modal.gameName === gameName
      );

      const isMaxModalsOpen = gameModals.length >= 5;

      if (!isAlreadyOpen && !isMaxModalsOpen) {
        const newGameModalProps: GameModalStateProps = {
          opponentUsername,
          gameName,
          position,
        };

        setGameModals(prev => [...prev, newGameModalProps]);
      }
    },
    [gameModals]
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
