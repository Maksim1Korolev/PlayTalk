import { useCallback, useState } from "react";

import resources from "@/shared/assets/locales/en/OnlinePageResources.json";

import { User } from "@/entities/User";
import { ChatModal } from "@/entities/Chat/model/types/chatModal";

export const useChatModals = () => {
  const [chatModals, setChatModals] = useState<ChatModal[]>([]);

  //TODO:Remove
  // const findNewModalPosition = (modals: ChatModal[]) => {
  //   let x = 400;
  //   let y = 300;
  //   const offset = 30;

  //   for (let i = 0; i < modals.length; i++) {
  //     const modal = modals[i];
  //     if (x === modal.position?.x && y === modal.position.y) {
  //       x -= offset;
  //       y -= offset;

  //       if (x < 0 || y < 0) {
  //         x = window.innerWidth - 400;
  //         y = window.innerHeight - 300;
  //       }
  //     }
  //   }
  //   console.log(x, y);

  //   return { x, y };
  // };

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
      //  const position = findNewModalPosition(chatModals || []);

      const newChatModalProps: ChatModal = { user }; // { user, position };

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
