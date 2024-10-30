import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAppSelector } from "@/shared/lib";
import { ModalContext } from "@/shared/lib/context/ModalContext";
import { AddonCircleProps, AppImageProps, CircleModal } from "@/shared/ui";
import { useModalPosition } from "@/shared/ui/CircleModal";
import getImagePath from "@/shared/utils/getImagePath";

import { ChatModal, UnreadMessagesCountIndicator } from "@/entities/Chat";
import { getCurrentUser, UserOnlineIndicator } from "@/entities/User";
import { ChatBox } from "@/features/chat";

export const ChatModals = memo(
  ({
    chatModals,
    onClose,
  }: {
    chatModals: ChatModal[];
    onClose: (username: string) => void;
  }) => {
    const currentUser = useAppSelector(getCurrentUser);

    const [avatarIconMap, setAvatarIconMap] = useState<{
      [key: string]: string;
    }>({});

    const { increaseModalCount, decreaseModalCount } = useContext(ModalContext);
    const { getStartingPosition } = useModalPosition();

    useEffect(() => {
      const loadIcons = async () => {
        const avatarMap: {
          [key: string]: string;
        } = {};

        for (const modal of chatModals) {
          const { user: opponentUser } = modal;

          const avatarUrl = getImagePath({
            collection: "avatars",
            fileName: opponentUser.avatarFileName,
          });
          if (opponentUser.avatarFileName) {
            avatarMap[opponentUser.avatarFileName] = avatarUrl;
          }
        }

        setAvatarIconMap(avatarMap);
      };

      if (chatModals.length > 0) {
        loadIcons();
      }
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

    const previousModalCountRef = useRef(chatModals.length);

    useEffect(() => {
      const previousCount = previousModalCountRef.current;
      const currentCount = chatModals.length;

      if (currentCount > previousCount) {
        increaseModalCount();
      } else if (currentCount < previousCount) {
        decreaseModalCount();
      }

      previousModalCountRef.current = currentCount;
    }, [chatModals.length]);

    const renderChatModals = useCallback(() => {
      const handleCloseChatModal = (modalId: string) => {
        onClose(modalId);
      };

      return chatModals?.map(({ user }) => {
        const { unreadMessageCount, avatarFileName, isOnline } = user;
        const modalId = user.username;

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
            <ChatBox currentUser={currentUser} receiverUser={user} />
          </CircleModal>
        );
      });
    }, [chatModals, currentUser, getAddonCircleProps, onClose]);

    return renderChatModals();
  }
);
