import { memo, useCallback } from "react";

import { useAppDispatch } from "@/shared/lib";
import { CircleModal, useModalPosition } from "@/shared/ui";

import { ChatModalData } from "@/entities/Chat";
import { Modal, modalActions } from "@/entities/Modal";
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
    const dispatch = useAppDispatch();

    const { getStartingPosition } = useModalPosition();

    const renderChatModals = useCallback(() => {
      const handleCloseChatModal = (modalId: string) => {
        onClose(modalId);
        dispatch(modalActions.removeModal(modalId));
      };

      return chatModals?.map(({ modalId, data }) => {
        const { recipientUsername } = data;

        const position = getStartingPosition();

        return (
          <CircleModal
            key={modalId}
            position={position}
            onClose={() => handleCloseChatModal(modalId)}
            headerString={`Chat with ${recipientUsername}`}
            collapsedComponent={
              <ChatAddonCircleContainer username={recipientUsername} />
            }
          >
            <ChatBox recipientUsername={recipientUsername} />
          </CircleModal>
        );
      });
    }, [chatModals, dispatch, getStartingPosition, onClose]);

    return renderChatModals();
  }
);
