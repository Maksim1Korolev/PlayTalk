import { cx } from "@/shared/lib/cx";
import { AppImage } from "@/shared/ui/AppImage";
import { getAvatarPath } from "@/shared/ui/AppImage/ui/AppImage";
import { memo } from "react";
import cls from "./ChatCircle.module.scss";

export const ChatCircle = memo(
  ({
    className,
    imageSrc,
    isOnline,
    unreadMessagesCount,
    onClick,
  }: {
    className?: string;
    imageSrc?: string;
    isOnline?: boolean;
    unreadMessagesCount?: number;
    onClick: () => void;
  }) => {
    //TODO: Add Max Unread Messages Count value and something
    return (
      <div onClick={onClick} className={`${cls.ChatCircle} ${className}`}>
        <div className={cls.chatOverlay}>
          <AppImage
            className={cls.profileImage}
            width={80}
            height={80}
            src={getAvatarPath(imageSrc)}
            draggable="false"
          />
        </div>
        <span
          className={cx(cls.onlineIndicator, { [cls.active]: isOnline })}
        ></span>

        {unreadMessagesCount && (
          <div className={cls.messageIndicator}>{unreadMessagesCount}</div>
        )}
      </div>
    );
  }
);
