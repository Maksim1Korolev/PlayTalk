import { cx } from "@/shared/lib/cx";
import { AppImage } from "@/shared/ui/AppImage";
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
    const avatarSrc = `${
      import.meta.env.VITE_AUTH_SERVER_STATIC_URL
    }/avatars/${imageSrc}`;
    //TODO: Add Max Unread Messages Count value and something
    return (
      <div onClick={onClick} className={`${cls.ChatCircle} ${className}`}>
        <div className={cls.chatOverlay}>
          <AppImage
            className={cls.profileImage}
            width={80}
            height={80}
            src={avatarSrc}
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
