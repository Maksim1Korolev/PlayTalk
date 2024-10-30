import { useCallback, useState } from "react";

import resources from "@/shared/assets/locales/en/OnlinePageResources.json";

import { ChatModal } from "@/entities/Chat";
import { User } from "@/entities/User";

export const useChatModals = () => {
  const [chatModals, setChatModals] = useState<ChatModal[]>([]);

  const handleOpenChatModal = useCallback(
    (user: User) => {
      if (chatModals && chatModals.length > 5) {
        alert(resources.chatModalQuantityError);
        return;
      }
      if (
        chatModals?.find(
          ({ user: currentUser }) => currentUser.username === user.username
        )
      ) {
        return;
      }

      const newChatModalProps: ChatModal = { user };

      setChatModals(prev => [...(prev || []), newChatModalProps]);
    },
    [chatModals]
  );

  const handleCloseChatModal = (username: string) => {
    setChatModals(prev =>
      prev.filter(modal => modal.user.username !== username)
    );
  };

  return {
    chatModals,
    handleOpenChatModal,
    handleCloseChatModal,
  };
};
