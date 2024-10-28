import { useCallback, useState } from "react";

import { GameData, GameModal } from "@/entities/Game";

export const useGameModals = () => {
  const [gameModals, setGameModals] = useState<GameModal[]>([]);

  const handleOpenGameModal = useCallback(
    ({
      gameData,
      position,
    }: {
      gameData: GameData;
      position?: { x: number; y: number };
    }) => {
      const isAlreadyOpen = gameModals.some(
        modal =>
          modal.gameData.opponentUsername === gameData.opponentUsername &&
          modal.gameData.gameName === gameData.gameName
      );

      const isMaxModalsOpen = gameModals.length >= 5;

      if (!isAlreadyOpen && !isMaxModalsOpen) {
        const newGameModalProps: GameModal = {
          gameData,
          position,
        };

        setGameModals(prev => [...prev, newGameModalProps]);
      }
    },
    [gameModals]
  );

  const handleCloseGameModal = useCallback(
    ({ gameData }: { gameData: GameData }) => {
      setGameModals(prev =>
        prev.filter(
          modal =>
            modal.gameData.opponentUsername !== gameData.opponentUsername ||
            modal.gameData.gameName !== gameData.gameName
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
