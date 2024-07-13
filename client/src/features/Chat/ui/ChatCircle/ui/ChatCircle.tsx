import { UserOnlineIndicator } from "@/entities/User/ui/UserOnlineIndicator";
import { AvatarWithProps } from "@/features/AvatarWithProps";
import { UnreadMessagesCountIndicator } from "@/features/UnreadMessagesCountIndicator";
import { cx } from "@/shared/lib/cx";
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
    return (
      <div onClick={onClick} className={cx(cls.ChatCircle, {}, [className])}>
        <div className={cls.chatOverlay}>
          <AvatarWithProps
            clickable
            onClick={onClick}
            avatarSrc={avatarSrc}
            addonTopRight={<UserOnlineIndicator isOnline={isOnline} />}
            addonBottomRight={
              <UnreadMessagesCountIndicator
                unreadMessagesCount={unreadMessagesCount}
              />
            }
          />
        </div>
      </div>
    );
  }
);
