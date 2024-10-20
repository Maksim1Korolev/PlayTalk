import { GameName, GameNames } from "@/entities/Game/model"
import { cx } from "@/shared/lib/className/cx"
import { HighlightType, useHighlight } from "@/shared/lib/hooks/useHighlight"
import { AppImage } from "@/shared/ui"
import getImagePath from "@/shared/utils/getImagePath"
import { useState } from "react"
import { CircleMenu, CircleMenuItem } from "react-circular-menu"
import cls from "./PlayButton.module.scss"

interface PlayButtonProps {
  className?: string;
  highlight?: HighlightType;
  onSelectGame: (gameName: GameName) => void;
}

export const PlayButton = ({
  className,
  highlight = "none",
  onSelectGame,
}: PlayButtonProps) => {
  const gameNames = Object.values(GameNames);
  const highlightClass = useHighlight(highlight);
  const [isSelectorOpen, setSelectorOpen] = useState(false);

  const toggleSelector = () => {
    setSelectorOpen(!isSelectorOpen);
  };

  const playButtonSrc = getImagePath({
    collection: "appIcons",
    fileName: "play",
  });

  return (
    <CircleMenu
      startAngle={-90}
      rotationAngle={360}
      itemSize={1.5}
      radius={2.4}
      rotationAngleInclusive={false}
      menuToggleElement={
        <AppImage
          width={50}
          height={50}
          src={playButtonSrc}
          clickable
          onClick={toggleSelector}
        />
      }
      open={isSelectorOpen}
    >
      {gameNames.map(gameName => {
        const gameSrc = getImagePath({
          collection: "gameIcons",
          fileName: gameName,
        });
        return (
          <CircleMenuItem key={gameName} tooltip={gameName}>
            <AppImage
              src={gameSrc}
              width={40}
              height={40}
              alt=""
              className={cx(cls.PlayButton, {
                [highlightClass]: !!highlightClass,
              })}
              clickable
              onClick={() => {
                onSelectGame(gameName);
              }}
            />
          </CircleMenuItem>
        );
      })}
    </CircleMenu>
  );
};
