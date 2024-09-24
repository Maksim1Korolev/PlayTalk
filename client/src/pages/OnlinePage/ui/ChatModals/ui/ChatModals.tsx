import { User } from "@/entities/User";
import { UserOnlineIndicator } from "@/entities/User/ui/UserOnlineIndicator";
import { ChatBox } from "@/features/Chat";
import { UnreadMessagesCountIndicator } from "@/features/UnreadMessagesCountIndicator";
import { ChatModalState } from "@/pages/OnlinePage/hooks/useChatModals";
import { AddonCircleProps, CircleModal, SVGProps } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";
import { memo, useCallback, useEffect, useState } from "react";

export const ChatModals = memo(
  ({
    currentUser,
    chatModals,
  }: {
    currentUser: User;
    chatModals: ChatModalState[] | undefined;
  }) => {
    const [addonCirclePropsMap, setAddonCirclePropsMap] = useState<{
      [userId: string]: AddonCircleProps | undefined;
    }>({});

    const getAddonCircleProps = useCallback(
      async ({
        unreadMessagesCount,
        avatarFileName,
        isOnline,
      }: {
        unreadMessagesCount: number | undefined;
        avatarFileName: string;
        isOnline: boolean;
      }) => {
        const avatarIconProps = await getAvatarIconProps(avatarFileName);

        if (!avatarIconProps) return;
				
        const addonCircleProps: AddonCircleProps = {
          iconProps: avatarIconProps,
          addonTopRight: (
            <UnreadMessagesCountIndicator
              unreadMessagesCount={unreadMessagesCount}
            />
          ),
          addonBottomRight: <UserOnlineIndicator isOnline={isOnline} />,
        };

        return addonCircleProps;
      },
      []
    );

    const getAvatarIconProps = async (avatarFileName: string) => {
      const size = 80;
      const iconPath = getImagePath({ avatarFileName });
      try {
        const AvatarSvg = await import(iconPath);

        const svgProps: SVGProps = {
          Svg: AvatarSvg.ReactComponent,
          width: size,
          height: size,
        };
        return svgProps;
      } catch (error) {
        console.error(`Failed to load icon for game: ${avatarFileName}`, error);
      }
    };
    const closeChatModal = useCallback(() => {}, []);

    useEffect(() => {
      const fetchAddonCircleProps = async () => {
        const newAddonCirclePropsMap: {
          [userId: string]: AddonCircleProps | undefined;
        } = {};

        if (chatModals) {
          for (const { user } of chatModals) {
            newAddonCirclePropsMap[user._id] = await getAddonCircleProps({
              avatarFileName: user?.avatarFileName,
              isOnline: user.isOnline,
              unreadMessagesCount: user.unreadMessageCount,
            });
          }
        }

        setAddonCirclePropsMap(newAddonCirclePropsMap);
      };

      fetchAddonCircleProps();
    }, [chatModals, getAddonCircleProps]);

    const renderChatModals = useCallback(() => {
      return chatModals?.map(({ user }) => (
        <CircleModal
          key={`${user._id}`}
          onClose={() => closeChatModal}
          headerString={`Chat with ${user.username}`}
          addonCircleProps={addonCirclePropsMap[user._id]}
        >
          <ChatBox currentUser={currentUser} receiverUser={user} />
        </CircleModal>
      ));
    }, [addonCirclePropsMap, chatModals, closeChatModal, currentUser]);

    return <>{renderChatModals()}</>;
  }
);
