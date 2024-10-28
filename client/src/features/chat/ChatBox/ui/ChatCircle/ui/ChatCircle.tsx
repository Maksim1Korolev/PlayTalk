import cls from "./ChatCircle.module.scss";

import { memo } from "react";

import { cx } from "@/shared/lib";

import { UserOnlineIndicator } from "@/entities/User";
import { AvatarWithProps } from "@/features/AvatarWithProps";
import { UnreadMessagesCountIndicator } from "@/features/UnreadMessagesCountIndicator";

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
    //TODO: onClick open modal
    const avatarSrc = `${
      import.meta.env.VITE_AUTH_SERVICE_STATIC_URL
    }/avatars/${avatarFileName}`;
    return (
      <div className={cx(cls.ChatCircle, {}, [className])}>
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
