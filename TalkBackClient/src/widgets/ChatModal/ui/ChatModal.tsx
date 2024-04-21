import { memo, useCallback, useEffect, useState } from "react";

import { User } from "@/entities/User";
import { Chat } from "@/features/Chat";

import { Message } from "@/features/Chat/ui/ChatMessage/ui/ChatMessage";
import { useReceiveMessage } from "@/pages/OnlinePage/hooks/useOnlineSocket";
import { cx } from "@/shared/lib/cx";
import { Card, HStack, UiButton, UiText } from "@/shared/ui";
import Draggable from "react-draggable";
import cls from "./ChatModal.module.scss";

export const ChatModal = memo(
  ({
    className,
    currentUsername,
    receiverUser,
    handleCloseModal,
    handleSendMessage,
  }: {
    className?: string;
    currentUsername: string;
    receiverUser: User;
    handleCloseModal: (userId: string) => void;
    handleSendMessage: (receiverUsername: string, message: string) => void;
  }) => {
    const [messageHistory, setMessageHistory] = useState<Message[]>();

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
      const newMessage: Message = {
        message: message,
        date: new Date(),
        username: username,
      };
      setMessageHistory((prev) => [...(prev || []), newMessage]);
    };

    const onUserSend = (message: string) => {
      handleSendMessage(receiverUser.username, message);
      AddMessageToHistory(currentUsername, message);
    };

    return (
      <Draggable
      //grid={[100, 20]}
      >
        <Card
          padding="16"
          variant="outlined"
          className={cx(cls.ChatModal, {}, [className])}
        >
          <HStack gap="24" className={cls.draggableChatTitle}>
            <UiButton
              variant="clear"
              onClick={() => handleCloseModal(receiverUser._id)}
            >
              X
            </UiButton>
            <UiText>{receiverUser.username}</UiText>
          </HStack>
          <Chat
            currentUsername={currentUsername}
            messageHistory={messageHistory}
            handleSendMessage={onUserSend}
          />
        </Card>
      </Draggable>
    );
  }
);
