import { User } from "@/entities/User";
import { ChatBox } from "@/features/Chat";
import { ChatModalStateProps } from "@/pages/OnlinePage/hooks/useChatModals";
import { AddonCircleProps, CircleModal } from "@/shared/ui";
import { AppImageProps } from "@/shared/ui/AppImage";
import { memo, useCallback, useEffect, useState } from "react";

export const ChatModals = memo(
  ({
    currentUser,
    chatModals,
    onClose,
  }: {
    currentUser: User;
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

          const avatarUrl = `https://testforavatars.s3.eu-north-1.amazonaws.com/avatars/${opponentUser.avatarFileName}`;

          try {
            avatarMap[opponentUser.avatarFileName] = avatarUrl;
          } catch (error) {
            console.error(
              `Failed to load avatar for user: ${opponentUser.username}`,
              error
            );
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
        avatarFileName: string;
        isOnline: boolean;
      }) => {
        const getAvatarIconProps = (avatarFileName: string) => {
          const size = 80;
          const avatarUrl = avatarIconMap[avatarFileName];

          const svgProps: AppImageProps = {
            src: avatarUrl,
            width: size,
            height: size,
            draggable: false,
            alt: avatarFileName,
          };
          return svgProps;
        };

        const avatarIconProps = getAvatarIconProps(avatarFileName);

        const addonCircleProps: AddonCircleProps = {
          iconProps: avatarIconProps,
          // addonTopRight: (
          //   <UnreadMessagesCountIndicator unreadMessagesCount={unreadMessageCount} />
          // ),
          // addonBottomRight: <UserOnlineIndicator isOnline={isOnline} />,
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
