import { CurrentUser } from "@/entities/User";
import { UserOnlineIndicator } from "@/entities/User/ui/UserOnlineIndicator";
import { ChatBox } from "@/features/Chat";
import { UnreadMessagesCountIndicator } from "@/features/UnreadMessagesCountIndicator";

import { AddonCircleProps, CircleModal } from "@/shared/ui";
import { AppImageProps } from "@/shared/ui/AppImage";
import { getAvatarPath } from "@/shared/ui/AppImage/ui/AppImage";
import { memo, useCallback, useEffect, useState } from "react";
import { ChatModalStateProps } from "../hooks/useChatModals";

export const ChatModals = memo(
  ({
    currentUser,
    chatModals,
    onClose,
  }: {
    currentUser: CurrentUser;
    chatModals: ChatModalStateProps[];
    onClose: (username: string) => void;
  }) => {
    const [avatarIconMap, setAvatarIconMap] = useState<{
      [key: string]: string; // Store the image URL directly
    }>({});

    useEffect(() => {
      const loadIcons = async () => {
        const avatarMap: {
          [key: string]: string; // Store the image URL directly
        } = {};

        for (const modal of chatModals) {
          const { user: opponentUser } = modal;

          const avatarUrl = getAvatarPath(opponentUser.avatarFileName);
          if (opponentUser.avatarFileName) {
            avatarMap[opponentUser.avatarFileName] = avatarUrl;
          }
        }

        setAvatarIconMap(avatarMap);
      };

      loadIcons();
    }, [chatModals]);

    const getAddonCircleProps = useCallback(
      ({
        unreadMessageCount,
        avatarFileName,
        isOnline,
      }: {
        unreadMessageCount: number | undefined;
        avatarFileName: string | undefined;
        isOnline: boolean | undefined;
      }) => {
        const getAvatarIconProps = (avatarFileName: string) => {
          const size = 80;
          const avatarUrl = avatarIconMap[avatarFileName];

          const imageProps: AppImageProps = {
            src: avatarUrl,
						clickable: false,
            width: size,
            height: size,
            draggable: false,
            alt: avatarFileName,
          };
          return imageProps;
        };

        const avatarIconProps = getAvatarIconProps(avatarFileName || "");

        const addonCircleProps: AddonCircleProps = {
          iconProps: avatarIconProps,
          addonTopRight: (
            <UnreadMessagesCountIndicator
              unreadMessagesCount={unreadMessageCount}
            />
          ),
          addonBottomRight: <UserOnlineIndicator isOnline={isOnline} />,
        };

        return addonCircleProps;
      },
      [avatarIconMap]
    );

    const renderChatModals = useCallback(() => {
      const handleCloseChatModal = (username: string) => {
        onClose(username);
      };

      return chatModals?.map(({ user }) => {
        const { unreadMessageCount, avatarFileName, isOnline } = user;
        return (
          <CircleModal
            key={`${user.username}`}
            onClose={() => handleCloseChatModal(user.username)}
            headerString={`Chat with ${user.username}`}
            addonCircleProps={getAddonCircleProps({
              unreadMessageCount,
              avatarFileName,
              isOnline,
            })}
          >
            <ChatBox currentUser={currentUser} receiverUser={user} />
          </CircleModal>
        );
      });
    }, [chatModals, currentUser, getAddonCircleProps, onClose]);

    return <div>{renderChatModals()}</div>;
  }
);
