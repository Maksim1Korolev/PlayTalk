import { useCallback, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/lib";

import { ChatModalData } from "@/entities/Chat";
import {
  getModalCount,
  getModalMaxCount,
  Modal,
  modalActions,
} from "@/entities/Modal";
import { User } from "@/entities/User";

export const useChatModals = () => {
  const [chatModals, setChatModals] = useState<Modal<ChatModalData>[]>([]);
  const dispatch = useAppDispatch();
  const modalCount = useAppSelector(getModalCount);
  const modalMaxCount = useAppSelector(getModalMaxCount);

  const handleOpenChatModal = useCallback(
    (user: User) => {
      if (chatModals && modalCount > modalMaxCount) {
        return;
      }
      if (
        chatModals?.find(
          ({ data: { user: currentUser } }) =>
            currentUser.username === user.username
        )
      ) {
        return;
      }

      const newChatModalProps: Modal<ChatModalData> = {
        modalId: user.username,
        data: { user },
      };

      setChatModals((prev) => [...(prev || []), newChatModalProps]);
      dispatch(modalActions.addModal(newChatModalProps));
    },
    [chatModals, dispatch]
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
