import { memo, useCallback, useEffect, useState } from "react";

import { User } from "@/entities/User";
import { Chat } from "@/features/Chat";
import { MessageHistory } from "@/features/Chat/ui/Chat";
import { cx } from "@/shared/lib/cx";
import cls from "./ChatModal.module.scss";
import { useReceiveMessage } from "@/pages/OnlinePage/hooks/useOnlineSocket";

export const ChatModal = memo(
  ({
    className,
    receiverUser,

    handleUserSend,
  }: {
    className?: string;

    receiverUser: User;

    handleUserSend: (receiverUsername: string, message: string) => void;
  }) => {
    const [messageHistory, setMessageHistory] = useState<MessageHistory[]>();

    const receiveMessageSubscribe = useCallback(
      ({
        senderUsername,
        message,
      }: {
        senderUsername: string;
        message: string;
      }) => {
        console.log(senderUsername);

        if (senderUsername === receiverUser.username)
          AddMessageToHistory(senderUsername, message);
      },
      []
    );
    useEffect(() => {
      const disconnect = useReceiveMessage(receiveMessageSubscribe);
      return () => {
        disconnect();
      };
    });

    const AddMessageToHistory = (username: string, message: string) => {
      const newMessage: MessageHistory = {
        message: message,
        date: new Date(),
        username: username,
      };
      setMessageHistory((prev) => [...(prev || []), newMessage]);
    };

    const onUserSend = (message: string) => {
      handleUserSend(receiverUser.username, message);
    };

    return (
      <div className={cx(cls.ChatModal, {}, [className])}>
        <Chat messageHistory={messageHistory} handleSendMessage={onUserSend} />
      </div>
    );
  }
);
