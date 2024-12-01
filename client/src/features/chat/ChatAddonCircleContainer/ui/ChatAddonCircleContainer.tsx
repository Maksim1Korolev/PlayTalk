import cls from "./ChatAddonCircleContainer.module.scss";

import { memo } from "react";

import { cx, useAppSelector } from "@/shared/lib";
import { AddonCircle } from "@/shared/ui";
import { Avatar } from "@/shared/ui/Avatar";

import { UnreadMessagesCountIndicator } from "@/entities/Chat";
import {
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
        <Avatar src={avatarUrl} size={size} />
      </AddonCircle>
    );
  }
);
