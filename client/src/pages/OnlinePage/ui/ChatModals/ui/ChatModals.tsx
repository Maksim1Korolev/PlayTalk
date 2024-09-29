import { User } from "@/entities/User";
import { ChatBox } from "@/features/Chat";
import { ChatModalStateProps } from "@/pages/OnlinePage/hooks/useChatModals";
import { AddonCircleProps, CircleModal, SVGProps } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";
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
      [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    }>({});

    useEffect(() => {
      const loadIcons = async () => {
        const iconMap: {
          [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        } = {};
        const avatarMap: {
          [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        } = {};

        for (const modal of chatModals) {
          const { user: opponentUser } = modal;

          const iconPath = opponentUser.avatarUrl;
          try {
            const importedIcon = await import(iconPath);
            iconMap[opponentUser.avatarFileName] = importedIcon.ReactComponent;
          } catch (error) {
            console.error(
              `Failed to load icon for user: ${opponentUser.username}`,
              error
            );
          }

          const avatarPath = getImagePath({
            avatarFileName: opponentUser?.avatarFileName,
          });

          try {
            const importedAvatar = await import(avatarPath);
            avatarMap[opponentUser.avatarFileName] =
              importedAvatar.ReactComponent;
          } catch (error) {
            console.error(
              `Failed to load avatar for user: ${opponentUser}`,
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
          const AvatarSvg = avatarIconMap[avatarFileName];

          const svgProps: SVGProps = {
            Svg: AvatarSvg,
            width: size,
            height: size,
          };
          return svgProps;
        };

        const avatarIconProps = getAvatarIconProps(avatarFileName);

        const addonCircleProps: AddonCircleProps = {
          iconProps: avatarIconProps,
          //addonTopRight: (
          //  <UnreadMessagesCountIndicator
          //    unreadMessagesCount={unreadMessageCount}
          //  />
          //),
          //addonBottomRight: <UserOnlineIndicator isOnline={isOnline} />,
        };

        return addonCircleProps;
      },
      []
    );
    const renderChatModals = useCallback(() => {
      const handleCloseChatModal = (handleCloseChatModal: string) => {
        onClose(handleCloseChatModal);
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

    //TODO: Check if we need div
    return <div>{renderChatModals()}</div>;
  }
);
