import cls from "./GameAddonCircleContainer.module.scss";

import { memo } from "react";

import { cx, useAppSelector } from "@/shared/lib";
import { AddonCircle, AppImage } from "@/shared/ui";
import { Avatar } from "@/shared/ui/Avatar";
import getImagePath from "@/shared/utils/getImagePath";

import { GameData } from "@/entities/game/Game";
import { getUserAvatarUrl } from "@/entities/User";

export const GameAddonCircleContainer = memo(
  ({ className, gameData }: { className?: string; gameData: GameData }) => {
    const { opponentUsername, gameName } = gameData;
    const opponentAvatarUrl = useAppSelector(
      getUserAvatarUrl(opponentUsername)
    );

    const gameIconUrl = getImagePath({
      collection: "gameIcons",
      fileName: gameName,
    });

    const size = 80;

    return (
      <AddonCircle
        addonTopRight={<Avatar src={opponentAvatarUrl} size={30} />}
        className={cx(cls.ChatAddonCircle, {}, [className])}
      >
        <AppImage
          className={cls.gameIcon}
          src={gameIconUrl}
          width={size}
          height={size}
          draggable={false}
          alt={gameName}
          highlight="active"
        />
      </AddonCircle>
    );
  }
);
