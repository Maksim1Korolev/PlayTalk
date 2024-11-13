import cls from "./GameAddonCircleContainer.module.scss";

import { memo } from "react";

import { cx, useAppSelector } from "@/shared/lib";
import { AddonCircle, AppImage } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import { GameData } from "@/entities/game/Game";
import { getUserAvatarFileName } from "@/entities/User";

export const GameAddonCircleContainer = memo(
  ({ className, gameData }: { className?: string; gameData: GameData }) => {
    const { opponentUsername, gameName } = gameData;
    const opponentAvatarFileName = useAppSelector(
      getUserAvatarFileName(opponentUsername)
    );

    const gameIconUrl = getImagePath({
      collection: "gameIcons",
      fileName: gameName,
    });
    const avatarIconUrl = getImagePath({
      collection: "avatars",
      fileName: opponentAvatarFileName,
    });

    const size = 80;

    return (
      <AddonCircle
        iconProps={{
          src: gameIconUrl,
          width: size,
          height: size,
          draggable: false,
          highlight: "primary",
        }}
        addonTopRight={
          avatarIconUrl ? (
            <AppImage
              src={avatarIconUrl}
              width={30}
              height={30}
              draggable={false}
            />
          ) : null
        }
        className={cx(cls.ChatAddonCircle, {}, [className])}
      />
    );
  }
);