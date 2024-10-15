import { GameNames } from "@/entities/Game/model";
import { User } from "@/entities/User";
import { cx } from "@/shared/lib/cx";
import { Card, HStack, Loader } from "@/shared/ui";
import {
  AddonCircle,
  AddonCircleProps,
} from "@/shared/ui/AddonCircle/ui/AddonCircle";
import { AppImageProps } from "@/shared/ui/AppImage";
import getImagePath from "@/shared/utils/getImagePath";
import { memo, ReactNode, useEffect, useState } from "react";
import cls from "./GameSelector.module.scss";

interface GameSelectorProps {
  className?: string;
  user: User;
  onGameSelect: ({
    opponentUsername,
    gameName,
    isActive,
    isInviting,
  }: {
    opponentUsername: string;
    gameName: string;
    isActive: boolean;
    isInviting: boolean;
  }) => void;
}

export const GameSelector = memo(
  ({ className = "", user, onGameSelect }: GameSelectorProps) => {
    const gameNames = Object.values(GameNames);

    const [iconMap, setIconMap] = useState<{
      [key: string]: string;
    }>({});
    const [highlight, setHighlight] = useState<
      "none" | "primary" | "secondary"
    >("none");

    useEffect(() => {
      const loadIcons = async () => {
        const icons: {
          [key: string]: string;
        } = {};

        for (const gameName of gameNames) {
          const iconPath = getImagePath({ gameName });

          icons[gameName] = iconPath;
        }

        setIconMap(icons);
      };

      loadIcons();
    }, []);

    useEffect(() => {
      const newHighlight =
        user.activeGames && user.activeGames.length > 0
          ? "primary"
          : user.isInviting
          ? "secondary"
          : "none";
      setHighlight(newHighlight);
    }, []);

    const isGameActive = (gameName: string): boolean => {
      if (user.activeGames) return user.activeGames.includes(gameName);
      return false;
    };

    const handleIconClick = (gameName: string): void => {
      const isActive = isGameActive(gameName);
      onGameSelect({
        opponentUsername: user.username,
        gameName,
        isActive,
        isInviting: user.isInviting || false,
      });
    };

    const getGameIcon = (gameName: string): ReactNode => {
      const size = 60;
      const gameIconUrl = iconMap[gameName];

      if (!gameIconUrl) {
        return <Loader />;
      }

      const appImageProps: AppImageProps = {
        src: gameIconUrl,
        width: size,
        height: size,
        //TODO:Fix useState (real-time problems)
        highlight: highlight,
        clickable: true,
        onClick: () => handleIconClick(gameName),
      };

      const addonCircleProps: AddonCircleProps = {
        iconProps: appImageProps,
      };
      return <AddonCircle {...addonCircleProps} />;
    };

    return (
      <Card className={cx(cls.GameSelector, {}, [className])}>
        <HStack>
          {gameNames.map(gameName => (
            <div key={gameName}>{getGameIcon(gameName)}</div>
          ))}
        </HStack>
      </Card>
    );
  }
);
