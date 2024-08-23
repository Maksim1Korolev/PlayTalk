import { memo } from "react";
import cls from "./GameSelector.module.scss";
import { cx } from "@/shared/lib/cx";
import { Card, HStack } from "@/shared/ui";
import { GameIcon } from "@/features/game/GameIcon";

export const GameSelector = ({
  className,
  opponentUsername,
  onGameSelect,
}: {
  className?: string;
  opponentUsername: string;
  onGameSelect: ({
    receiverUsername,
    gameName,
  }: {
    receiverUsername: string;
    gameName: string;
  }) => void;
}) => {
  
  //TODO: Make into enum and move
  const gameNames = ["tic-tac-toe"];

  const handleIconClick = (gameName: string) => {
    onGameSelect({ receiverUsername: opponentUsername, gameName });
  };
  return (
    <Card className={`${cls.GameSelector} ${className}`}>
      <HStack>
        {gameNames.map(gameName => (
          <GameIcon
            key={gameName}
            gameName={gameName}
            onClick={() => handleIconClick(gameName)}
          />
        ))}
      </HStack>
    </Card>
  );
};
