import cls from "./GameSelector.module.scss";

import { memo, ReactNode, useEffect, useState } from "react";

import { cx } from "@/shared/lib";
import { AppImage, AppImageProps, Card, HStack, Loader } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import {
  GameData,
  GameName,
  GameNames,
  isGameName,
} from "@/entities/game/Game";
import { User } from "@/entities/User";

interface GameSelectorProps {
  className?: string;
  user: User;
  onGameSelect: ({
    gameData,
    isActive,
    isInviting,
  }: {
    gameData: GameData;
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

    //TODO: remove
    useEffect(() => {
      const loadIcons = async () => {
        const icons: {
          [key: string]: string;
        } = {};

        for (const gameName of gameNames) {
          const iconPath = getImagePath({
            collection: "gameIcons",
            fileName: gameName,
          });

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
    //}, [user.activeGames, user.isInviting]);

    const isGameActive = (gameName: GameName): boolean => {
      if (user.activeGames) return user.activeGames.includes(gameName);
      return false;
    };

    const handleIconClick = (gameName: string): void => {
      if (!isGameName(gameName)) return;
      const isActive = isGameActive(gameName);
      onGameSelect({
        gameData: {
          opponentUsername: user.username,
          gameName,
        },
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
        draggable: false,
        width: size,
        height: size,
        //TODO:Fix useState (real-time problems in case game selector doesn't disappear)
        highlight: highlight,
        clickable: true,
        onClick: () => handleIconClick(gameName),
      };

      return <AppImage {...appImageProps} />;
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
