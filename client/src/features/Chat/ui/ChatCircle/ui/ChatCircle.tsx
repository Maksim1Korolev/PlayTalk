import { UserOnlineIndicator } from "@/entities/User/ui/UserOnlineIndicator";
import { UnreadMessagesCountIndicator } from "@/features/UnreadMessagesCountIndicator";
import { cx } from "@/shared/lib/cx";
import { Avatar } from "@/shared/ui/Avatar";
import { memo } from "react";
import cls from "./ChatCircle.module.scss";

export const ChatCircle = memo(
  ({
    className,
    avatarFileName,
    isOnline,
    unreadMessagesCount,
    onClick,
  }: {
    className?: string;
    avatarFileName?: string;
    isOnline?: boolean;
    unreadMessagesCount?: number;
    onClick: () => void;
  }) => {
    const avatarSrc = `${
      import.meta.env.VITE_AUTH_SERVICE_STATIC_URL
    }/avatars/${avatarFileName}`;
    //TODO: Add Max Unread Messages Count value and something
    return (
      <div onClick={onClick} className={cx(cls.ChatCircle, {}, [className])}>
        <div className={cls.chatOverlay}>
          <Avatar className={cls.profileImage} src={avatarSrc} />
        </div>

        <UserOnlineIndicator
          className={cls.onlineIndicator}
          isOnline={isOnline}
        />

        <UnreadMessagesCountIndicator
          className={cls.messagesIndicator}
          unreadMessagesCount={unreadMessagesCount}
        />
      </div>
    );
  }
);
