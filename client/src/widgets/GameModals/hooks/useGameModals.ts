import { useCallback, useState } from "react"

import { GameData } from "@/entities/game/Game"
import { getModalCount, getModalMaxCount, Modal, modalActions } from '@/entities/Modal'
import { useAppDispatch, useAppSelector } from '@/shared/lib'


export const generateModalId = (gameData: GameData): string => {
  return `${gameData.opponentUsername}_${gameData.gameName}`;
};

export const useGameModals = () => {
  const [gameModals, setGameModals] = useState<Modal<GameData>[]>([]);

	const dispatch = useAppDispatch()
	const modalCount = useAppSelector(getModalCount)
	const modalMaxCount = useAppSelector(getModalMaxCount)

  const handleOpenGameModal = useCallback(
    ({
      gameData,
      position,
    }: {
      gameData: GameData;
      position?: { x: number; y: number };
    }) => {
			const modalId = generateModalId(gameData)

      const isAlreadyOpen = gameModals.some(
        modal =>
          modal.modalId === modalId
      );

      const isMaxModalsOpen = modalCount >= modalMaxCount;

      if (isAlreadyOpen || isMaxModalsOpen) {
				return 
			}

        const newGameModalProps: Modal<GameData> = {
					modalId ,
          data: gameData,
          position,
        };

        setGameModals(prev => [...prev, newGameModalProps]);
				dispatch(modalActions.addModal(newGameModalProps))
      
    },
    [dispatch, gameModals, modalCount, modalMaxCount]
  );

  const handleCloseGameModal = useCallback(
    ({modalId }: {modalId: string}) => {
      setGameModals(prev =>
        prev.filter(
          modal =>
            modal.modalId !== modalId 
        )
      );
			dispatch(modalActions.removeModal(modalId))
    },
    []
  );

  return {
    gameModals,
    handleOpenGameModal,
    handleCloseGameModal,
  };
};
