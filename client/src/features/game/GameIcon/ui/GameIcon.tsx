import { memo } from "react";
import cls from "./GameIcon.module.scss";
import { cx } from "@/shared/lib/cx";
import { AppImage } from "@/shared/ui";

export const GameIcon = ({
  className,
  gameName,
  onClick,
}: {
  className?: string;
  gameName: string;
  onClick: () => void;
}) => {
  const iconSrc = `@/shared/assets/icons/gameIcons/${gameName}-icon`;
  return (
    <AppImage
      className={cls.GameIcon}
      //  width={1}
      //  height={1}
      src={iconSrc}
      draggable="false"
      onClick={onClick}
    />
  );
};
