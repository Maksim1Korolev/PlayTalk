import { memo, useCallback } from "react";

import { CircleModal, useModalPosition } from "@/shared/ui";

import { GameModalData } from "@/entities/game/Game";
import { Modal } from "@/entities/Modal";
import { GameContainer } from "@/features/game";
import { GameAddonCircleContainer } from "@/features/game/GameAddonCircleContainer";

interface GameModalsProps {
  gameModals: Modal<GameModalData>[];
  onClose: ({ modalId }: { modalId: string }) => void;
}

export const GameModals = memo(({ gameModals, onClose }: GameModalsProps) => {
  const { getStartingPosition } = useModalPosition();

  const renderGameModals = useCallback(() => {
    const getGameComponent = ({
      modalId,
      gameData,
    }: {
      modalId: string;
      gameData: GameModalData;
    }) => {
      const { opponentUsername } = gameData;

      const headerString = `Opponent: ${opponentUsername}`;
      const position = getStartingPosition();

      return (
        <CircleModal
          key={modalId}
          headerString={headerString}
          position={position}
          width={365}
          height={520}
          collapsedComponent={<GameAddonCircleContainer gameData={gameData} />}
          onClose={() => handleCloseGameModal(modalId)}
        >
          <GameContainer gameData={gameData} />
        </CircleModal>
      );
    };

    const handleCloseGameModal = (modalId: string) => {
      onClose({ modalId });
    };

    return gameModals.map(({ modalId, data }) =>
      getGameComponent({ modalId, gameData: data })
    );
  }, [gameModals, onClose, getStartingPosition]);

  return renderGameModals();
});
