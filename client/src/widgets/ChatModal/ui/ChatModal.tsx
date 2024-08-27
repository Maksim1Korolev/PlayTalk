import { useEffect, useState } from "react";

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
  currentUser,
  receiverUser,
  position,
  handleReadAllUnreadMessages,
  handleCloseModal,
  handleSendMessage,
}: {
  className?: string;
  currentUser: User;
  receiverUser: User;
  position?: { x: number; y: number };
  handleReadAllUnreadMessages: (usernames: string[]) => void;
  handleCloseModal: (userId: string) => void;
  handleSendMessage: (receiverUsername: string, message: Message) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { isDragged, handleDragStart, handleDragStop } = useModalDrag();

	const [isTyping, setIsTyping] = useState(false);

  const handleOpenChatModal = () => {
    if (!isDragged) {
      setIsOpen(true);
    }
  };
  useEffect(() => {
    if (isOpen) {
      handleReadAllUnreadMessages([
        currentUser.username,
        receiverUser.username,
      ]);
    }
  }, [
    currentUser.username,
    isOpen,
    handleReadAllUnreadMessages,
    receiverUser.username,
  ]);

  const handleCloseChatModal = () => {
    if (!isDragged) {
      setIsOpen(false);
    }
  };

  const { messageHistory, onUserSend, addMessagesToHistory } = useModalMessages(
    {
      currentUsername: currentUser.username,
      receiverUsername: receiverUser.username,
      handleSendMessage,
    }
  );

  useReceiveMessage(receiverUser.username, addMessagesToHistory, setIsTyping);

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
      enableResizing={isOpen}
    >
      {isOpen ? (
        <Chat
          className={cx(cls.ChatModal, {}, [className])}
          isOpen={isOpen}
					isTyping={isTyping}
          handleSendMessage={onUserSend}
          receiverUser={receiverUser}
          messageHistory={messageHistory}
          onClose={() => handleCloseModal(receiverUser._id)}
          onCollapse={handleCloseChatModal}
        />
      ) : (
        <ChatCircle
          unreadMessagesCount={receiverUser.unreadMessageCount}
          isOnline={receiverUser.isOnline}
          avatarFileName={receiverUser.avatarFileName}
          className={cx(cls.ChatModal, {}, [className])}
          onClick={handleOpenChatModal}
        />
      )}
    </Rnd>
  );
};
