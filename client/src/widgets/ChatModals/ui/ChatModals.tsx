import { memo } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { CircleModal, useModalPosition } from "@/shared/ui";

import { ChatModalData } from "@/entities/Chat";
import { Modal, modalActions } from "@/entities/Modal";
import { getCurrentUser } from "@/entities/User";
import { ChatBox } from "@/features/chat";
import { ChatAddonCircleContainer } from "@/features/chat/ChatAddonCircleContainer";

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

    const renderChatModals = () => {
      const handleCloseChatModal = (modalId: string) => {
        onClose(modalId);
        dispatch(modalActions.removeModal(modalId));
      };

      return chatModals?.map(({ modalId, data }) => {
        const { user } = data;
        const { username } = user;

        const position = getStartingPosition();

        return (
          <CircleModal
            key={modalId}
            position={position}
            onClose={() => handleCloseChatModal(modalId)}
            headerString={`Chat with ${user.username}`}
            collapsedComponent={
              <ChatAddonCircleContainer username={username} />
            }
          >
            <ChatBox currentUser={currentUser} recipient={user} />
          </CircleModal>
        );
      });
    };

    return renderChatModals();
  }
);
