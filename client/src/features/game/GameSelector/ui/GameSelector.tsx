import { memo } from "react";
import cls from "./GameSelector.module.scss";
import { cx } from "@/shared/lib/cx";
import { Card, HStack } from "@/shared/ui";
import { GameIcon } from "@/features/game/GameIcon";
import GameNames from "@/entities/Game/model/enums/gameNames";
import { User } from "@/entities/User";

interface GameSelectorProps {
  className?: string;
  user: User;
  onGameSelect: ({
    opponentUsername,
    gameName,
    isActive,
  }: {
    opponentUsername: string;
    gameName: string;
    isActive: boolean;
  }) => void;
}

export const GameSelector = memo(
  ({ className = "", user, onGameSelect }: GameSelectorProps) => {
    const gameNames = Object.values(GameNames);

    const isGameActive = (gameName: string): boolean => {
      return user.activeGames.includes(gameName);
    };

    const handleIconClick = (gameName: string) => {
      const isActive = isGameActive(gameName);
      onGameSelect({
        opponentUsername: user.username,
        gameName,
        isActive,
      });
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
