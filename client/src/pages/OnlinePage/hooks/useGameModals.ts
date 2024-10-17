import {
  GameData,
  GameModalStateProps,
} from "@/entities/Game/model/types/gameModalStateProps";
import { useCallback, useState } from "react";

export const useGameModals = () => {
  const [gameModals, setGameModals] = useState<GameModalStateProps[]>([]);

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
        const newGameModalProps: GameModalStateProps = {
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
