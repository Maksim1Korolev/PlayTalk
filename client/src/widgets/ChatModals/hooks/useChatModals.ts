import { useCallback, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/lib";

import { ChatModalData } from "@/entities/Chat";
import {
  getModalCount,
  getModalMaxCount,
  Modal,
  modalActions,
} from "@/entities/Modal";

export const useChatModals = () => {
  const [chatModals, setChatModals] = useState<Modal<ChatModalData>[]>([]);
  const dispatch = useAppDispatch();
  const modalCount = useAppSelector(getModalCount);
  const modalMaxCount = useAppSelector(getModalMaxCount);

  const handleOpenChatModal = useCallback(
    (recipientUsername: string) => {
      if (chatModals && modalCount > modalMaxCount) {
        return;
      }
      if (
        chatModals?.find(
          ({ data: { recipientUsername: currentUsername } }) =>
            currentUsername === recipientUsername
        )
      ) {
        return;
      }

      const newChatModalProps: Modal<ChatModalData> = {
        modalId: recipientUsername,
        data: { recipientUsername },
      };

      setChatModals((prev) => [...(prev || []), newChatModalProps]);
      dispatch(modalActions.addModal(newChatModalProps));
    },
    [chatModals, dispatch, modalCount, modalMaxCount]
  );

  const handleCloseChatModal = (modalId: string) => {
    setChatModals((prev) => prev.filter((modal) => modal.modalId !== modalId));
    dispatch(modalActions.removeModal(modalId));
  };

  return {
    chatModals,
    handleOpenChatModal,
    handleCloseChatModal,
  };
};
