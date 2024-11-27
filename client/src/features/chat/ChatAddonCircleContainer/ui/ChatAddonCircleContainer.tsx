import cls from "./ChatAddonCircleContainer.module.scss";

import { memo } from "react";

import { cx, useAppSelector } from "@/shared/lib";
import { AddonCircle, AppImage } from "@/shared/ui";

import { UnreadMessagesCountIndicator } from "@/entities/Chat";
import {
  getUserAvatarFileName,
  getUserAvatarUrl,
  getUserOnlineStatus,
  getUserUnreadMessageCount,
  UserOnlineIndicator,
} from "@/entities/User";

export const ChatAddonCircleContainer = memo(
  ({ className, username }: { className?: string; username: string }) => {
    const unreadMessageCount = useAppSelector(
      getUserUnreadMessageCount(username)
    );
    const isOnline = useAppSelector(getUserOnlineStatus(username));

    const avatarFileName = useAppSelector(getUserAvatarFileName(username));
    const avatarUrl = useAppSelector(getUserAvatarUrl(username));

    const size = 80;

    return (
      <AddonCircle
        addonTopRight={
          <UnreadMessagesCountIndicator
            unreadMessagesCount={unreadMessageCount}
          />
        }
        addonBottomRight={<UserOnlineIndicator isOnline={isOnline} />}
        className={cx(cls.ChatAddonCircle, {}, [className])}
      >
        <AppImage
          src={avatarUrl}
          width={size}
          height={size}
          draggable={false}
          alt={avatarFileName}
        />
      </AddonCircle>
    );
  }
);
