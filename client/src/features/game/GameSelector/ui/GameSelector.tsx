import { memo } from "react";
import cls from "./GameSelector.module.scss";
import { cx } from "@/shared/lib/cx";
import { Card, HStack } from "@/shared/ui";
import { GameIcon } from "@/features/game/GameIcon";
import GameNames from "@/entities/Game/model/enums/gameNames"; // Corrected import usage

interface GameSelectorProps {
  className?: string;
  opponentUsername: string;
  activeGames: string[];
  onGameSelect: ({
    receiverUsername,
    gameName,
  }: {
    receiverUsername: string;
    gameName: string;
  }) => void;
}

export const GameSelector = memo(
  ({
    className = "",
    opponentUsername,
    activeGames,
    onGameSelect,
  }: GameSelectorProps) => {
    const gameNames = Object.values(GameNames);

    const isGameActive = (gameName: string): boolean => {
      return activeGames.includes(gameName);
    };

    const handleIconClick = (gameName: string) => {
      onGameSelect({ receiverUsername: opponentUsername, gameName });
    };

    return (
      <Card className={cx(cls.GameSelector, {}, [className])}>
        <HStack>
          {gameNames.map(gameName => (
            <GameIcon
              key={gameName}
              gameName={gameName}
              isActive={isGameActive(gameName)}
              onClick={() => handleIconClick(gameName)}
            />
          ))}
        </HStack>
      </Card>
    );
  }
);
