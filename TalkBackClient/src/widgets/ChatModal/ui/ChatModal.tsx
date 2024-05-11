import { useState } from "react";

import { User } from "@/entities/User";
import { Chat } from "@/features/Chat";

import { ChatCircle } from "@/features/Chat/ui/ChatCircle";
import { Message } from "@/features/Chat/ui/ChatMessage/ui/ChatMessage";
import { useReceiveMessage } from "@/pages/OnlinePage/hooks/useChatModals";
import { cx } from "@/shared/lib/cx";
import { Rnd } from "react-rnd";
import { useModalDrag } from "../hooks/useModalDrag";
import { useModalMessages } from "../hooks/useModalMessages";
import cls from "./ChatModal.module.scss";

export const ChatModal = ({
  className,
  currentUsername,
  receiverUser,
  position,
  handleCloseModal,
  handleSendMessage,
}: {
  className?: string;
  currentUsername: string;
  receiverUser: User;
  position?: { x: number; y: number };
  handleCloseModal: (userId: string) => void;
  handleSendMessage: (receiverUsername: string, message: Message) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { isDragged, handleDragStart, handleDragStop } = useModalDrag();

  const handleOpenChatModal = () => {
    if (!isDragged) {
      setIsOpen(true);
    }
  };

  const handleCloseChatModal = () => {
    if (!isDragged) {
      setIsOpen(false);
    }
  };

  const { messageHistory, onUserSend, AddMessagesToHistory } = useModalMessages(
    {
      currentUsername,
      receiverUsername: receiverUser.username,
      handleSendMessage,
    }
  );

  useReceiveMessage(receiverUser.username, AddMessagesToHistory);

  return (
    <Rnd
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      default={{
        x: position?.x || 0,
        y: position?.y || 0,
        width: 80,
        height: 80,
      }}
      minWidth={isOpen ? 365 : 80}
      minHeight={isOpen ? 280 : 80}
      bounds="window"
      enableResizing={false}
    >
      {isOpen ? (
        <Chat
          className={cx(cls.ChatModal, {}, [className])}
          handleSendMessage={onUserSend}
          currentUsername={currentUsername}
          messageHistory={messageHistory}
          receiverUsername={receiverUser.username}
          onClose={() => handleCloseModal(receiverUser._id)}
          onCollapse={handleCloseChatModal}
        />
      ) : (
        <ChatCircle
          unreadMessagesCount={receiverUser.unreadMessageCount}
          avatarFileName={receiverUser.avatarFileName}
          className={cx(cls.ChatModal, {}, [className])}
          onClick={handleOpenChatModal}
        />
      )}
    </Rnd>
  );
};
