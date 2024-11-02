import {
	memo,
	useCallback,
	useEffect,
	useState
} from "react"

import { useAppDispatch, useAppSelector } from "@/shared/lib"
import { AddonCircleProps, AppImageProps, CircleModal } from "@/shared/ui"
import { useModalPosition } from "@/shared/ui/CircleModal"
import getImagePath from "@/shared/utils/getImagePath"

import { ChatData, UnreadMessagesCountIndicator } from "@/entities/Chat"
import { Modal, modalActions } from '@/entities/Modal'
import { getCurrentUser, UserOnlineIndicator } from "@/entities/User"
import { ChatBox } from "@/features/chat"

export const ChatModals = memo(
  ({
    chatModals,
    onClose,
  }: {
    chatModals: Modal<ChatData>[];
    onClose: (modalIdß: string) => void;
  }) => {
    const currentUser = useAppSelector(getCurrentUser);

    const [avatarIconMap, setAvatarIconMap] = useState<{
      [key: string]: string;
    }>({});

		const dispatch = useAppDispatch()

    const { getStartingPosition } = useModalPosition();

    useEffect(() => {
      const loadIcons = async () => {
        const avatarMap: {
          [key: string]: string;
        } = {};

        for (const modal of chatModals) {
          const { data } = modal;
					const {user: opponentUser} = data

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


    const renderChatModals = useCallback(() => {
      const handleCloseChatModal = (modalId: string) => {
        onClose(modalId);
				dispatch(modalActions.removeModal(modalId))
      };

      return chatModals?.map(({ modalId, data }) => {
				const {user} = data
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
            <ChatBox currentUser={currentUser} receiverUser={user} />
          </CircleModal>
        );
      });
    }, [chatModals, currentUser, dispatch, getAddonCircleProps, getStartingPosition, onClose]);

    return renderChatModals();
  }
);
