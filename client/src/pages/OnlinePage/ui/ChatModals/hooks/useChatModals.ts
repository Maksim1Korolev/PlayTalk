import { User } from "@/entities/User";
import resources from "@/shared/assets/locales/en/OnlinePageResources.json";
import { useCallback, useState } from "react";

export interface ChatModalStateProps {
  user: User;
  position?: { x: number; y: number };
}

export const useChatModals = () => {
  const [chatModals, setChatModals] = useState<ChatModalStateProps[]>([]);

  //TODO:Remove
  // const findNewModalPosition = (modals: ChatModalStateProps[]) => {
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

      const newChatModalProps: ChatModalStateProps = { user }; // { user, position };

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
