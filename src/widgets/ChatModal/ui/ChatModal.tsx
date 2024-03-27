import { memo, useState } from "react";

import { User } from "../../../entities/User";
import { Chat } from "../../../features/Chat";
import { cx } from "../../../shared/lib/cx";
import { useChatSocket } from "../hooks/useChatSocket";
import cls from "./ChatModal.module.scss";
import { MessageHistory } from "../../../features/Chat/ui/Chat";

export const ChatModal = memo(
  ({
    className,
    currentUser,
    receiverUser,
  }: {
    className?: string;
    currentUser: User;
    receiverUser: User;
  }) => {
    const [messageHistory, setMessageHistory] = useState<MessageHistory[]>();

    const AddMessageToHistory = (username: string, message: string) => {
      const newMessage: MessageHistory = {
        message: message,
        date: new Date(),
        username: username,
      };
      setMessageHistory((prev) => [...(prev || []), newMessage]);
    };

    const onMessageReceived = ({
      senderUsername,
      message,
    }: {
      senderUsername: string;
      message: string;
    }) => {
      AddMessageToHistory(receiverUser.username, message);
    };

    const handleCurrentUserSend = (message: string) => {
      AddMessageToHistory(currentUser.username, message);
      handleUserMessage(message);
    };

    const { handleUserMessage } = useChatSocket({
      currentUsername: currentUser.username,
      receiverUsername: receiverUser.username,
      printMessage: onMessageReceived,
    });

    return (
      <div className={cx(cls.ChatModal, {}, [className])}>
        <Chat
          messageHistory={messageHistory}
          handleSendMessage={handleCurrentUserSend}
        />
      </div>
    );
  }
);
