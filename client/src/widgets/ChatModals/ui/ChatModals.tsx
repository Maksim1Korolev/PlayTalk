import { memo, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/lib";
import {
  AddonCircleProps,
  AppImageProps,
  CircleModal,
  useModalPosition,
} from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import { ChatModalData, UnreadMessagesCountIndicator } from "@/entities/Chat";
import { Modal, modalActions } from "@/entities/Modal";
import { getCurrentUser, UserOnlineIndicator } from "@/entities/User";
import { ChatBox } from "@/features/chat";

export const ChatModals = memo(
  ({
    chatModals,
    onClose,
  }: {
    chatModals: Modal<ChatModalData>[];
    onClose: (modalIdß: string) => void;
  }) => {
    const currentUser = useAppSelector(getCurrentUser);

    const dispatch = useAppDispatch();

    const { getStartingPosition } = useModalPosition();

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
        const getAvatarIconProps = (avatarFileName?: string) => {
          const size = 80;
          const avatarUrl = getImagePath({
            collection: "avatars",
            fileName: avatarFileName,
          });

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

        const avatarIconProps = getAvatarIconProps(avatarFileName);

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
      []
    );

    const renderChatModals = useCallback(() => {
      const handleCloseChatModal = (modalId: string) => {
        onClose(modalId);
        dispatch(modalActions.removeModal(modalId));
      };

      return chatModals?.map(({ modalId, data }) => {
        const { user } = data;
        const { unreadMessageCount, avatarFileName, isOnline } = user;

        const position = getStartingPosition();

        return (
          <CircleModal
            key={modalId}
            position={position}
            onClose={() => handleCloseChatModal(modalId)}
            headerString={`Chat with ${user.username}`}
            addonCircleProps={getAddonCircleProps({
              unreadMessageCount,
              avatarFileName,
              isOnline,
            })}
          >
            <ChatBox currentUser={currentUser} recipient={user} />
          </CircleModal>
        );
      });
    }, [
      chatModals,
      currentUser,
      dispatch,
      getAddonCircleProps,
      getStartingPosition,
      onClose,
    ]);

    return renderChatModals();
  }
);
