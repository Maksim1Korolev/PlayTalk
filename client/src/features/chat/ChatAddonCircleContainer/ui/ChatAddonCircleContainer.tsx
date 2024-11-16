import cls from "./ChatAddonCircleContainer.module.scss";

import { memo } from "react";

import { cx, useAppSelector } from "@/shared/lib";
import { AddonCircle, AppImage } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import { UnreadMessagesCountIndicator } from "@/entities/Chat";
import {
  getUserAvatarFileName,
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

    const avatarPath = getImagePath({
      collection: "avatars",
      fileName: avatarFileName,
    });

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
          src={avatarPath}
          width={size}
          height={size}
          draggable={false}
          alt={avatarFileName}
        />
      </AddonCircle>
    );
  }
);
