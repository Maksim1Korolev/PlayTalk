import { cx } from "@/shared/lib/cx";
import { Avatar } from "@/shared/ui/Avatar";
import { memo } from "react";
import cls from "./AvatarWithProps.module.scss";

export const AvatarWithProps = memo(
  ({
    className,
    avatarSrc,
    size = 80,
    addonTopRight,
    addonBottomRight,
    addonTopLeft,
    addonBottomLeft,
    onClick,
  }: {
    className?: string;
    avatarSrc: string;
    size?: number;
    addonTopRight?: React.ReactNode;
    addonBottomRight?: React.ReactNode;
    addonTopLeft?: React.ReactNode;
    addonBottomLeft?: React.ReactNode;
    onClick?: () => void;
  }) => {
    return (
      <div className={cls.AvatarWithProps}>
        <Avatar
          onClick={onClick}
          className={cx(cls.avatar, {}, [className])}
          src={avatarSrc}
          size={size}
        />
        <div className={cls.addonTopRight}>{addonTopRight}</div>
        <div className={cls.addonBottomRight}>{addonBottomRight}</div>
        <div className={cls.addonTopLeft}>{addonTopLeft}</div>
        <div className={cls.addonBottomLeft}>{addonBottomLeft}</div>
      </div>
    );
  }
);
