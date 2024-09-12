import { memo, useState, useEffect, ReactNode } from "react";
import cls from "./GameSelector.module.scss";
import { cx } from "@/shared/lib/cx";
import { Card, HStack, SVGProps, AppSvg, Loader } from "@/shared/ui";
import { GameNames } from "@/entities/Game/model";
import { User } from "@/entities/User";
import getImagePath from "@/shared/utils/getImagePath";

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
      [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    }>({});
    const [highlight, setHighlight] = useState<
      "none" | "primary" | "secondary"
    >("none");

    useEffect(() => {
      const loadIcons = async () => {
        const icons: {
          [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        } = {};

        for (const gameName of gameNames) {
          const iconPath = getImagePath({ gameName });
          try {
            const importedIcon = await import(iconPath);
            icons[gameName] = importedIcon.ReactComponent;
          } catch (error) {
            console.error(`Failed to load icon for game: ${gameName}`, error);
          }
        }

        setIconMap(icons);
      };

      loadIcons();
    }, [gameNames]);

    useEffect(() => {
      const newHighlight =
        user.activeGames.length > 0
          ? "primary"
          : user.isInviting
          ? "secondary"
          : "none";
      setHighlight(newHighlight);
    }, [user.activeGames.length, user.isInviting]);

    const isGameActive = (gameName: string): boolean => {
      return user.activeGames.includes(gameName);
    };

    const handleIconClick = (gameName: string): void => {
      const isActive = isGameActive(gameName);
      onGameSelect({
        opponentUsername: user.username,
        gameName,
        isActive,
        isInviting: user.isInviting,
      });
    };

    const getGameIcon = (gameName: string): ReactNode => {
      const size = 60;
      const SvgComponent = iconMap[gameName];

      if (!SvgComponent) {
        return <Loader />;
      }

      const svgProps: SVGProps = {
        Svg: SvgComponent,
        width: size,
        height: size,
        //TODO:Fix useState (real-time problems)
        highlight: highlight,
        clickable: true,
        onClick: () => handleIconClick(gameName),
      };

      return <AppSvg {...svgProps} ref={undefined} />;
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
