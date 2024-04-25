import { memo, useCallback, useEffect, useState } from "react";

import { User } from "@/entities/User";
import { Chat } from "@/features/Chat";

import { ChatCircle } from "@/features/Chat/ui/ChatCircle";
import { Message } from "@/features/Chat/ui/ChatMessage/ui/ChatMessage";
import { useReceiveMessage } from "@/pages/OnlinePage/hooks/useChatModals";
import { cx } from "@/shared/lib/cx";
import { Rnd } from "react-rnd";
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
    handleSendMessage: (receiverUsername: string, message: Message) => void;
  }) => {
    const [messageHistory, setMessageHistory] = useState<Message[]>();

    const [chatOpen, setChatOpen] = useState<boolean>(false);

    const AddMessageToHistory = useCallback((message: Message) => {
      setMessageHistory((prev) => [...(prev || []), message]);
    }, []);

    const AddMessagesToHistory = useCallback((messages: Message[]) => {
      setMessageHistory((prev) => [...(prev || []), ...messages]);
    }, []);

    const receiveMessageSubscribe = useCallback(
      ({
        senderUsername,
        message,
      }: {
        senderUsername: string;
        message: Message;
      }) => {
        if (senderUsername === receiverUser.username) {
          AddMessageToHistory(message);
        }
      },
      [AddMessageToHistory, receiverUser.username]
    );

    const updateChatHistory = useCallback(
      (messages: Message[], receiverUsername: string) => {
        if (receiverUsername === receiverUser.username) {
          AddMessagesToHistory(messages);
        }
      },
      [AddMessagesToHistory, receiverUser.username]
    );

    useEffect(() => {
      const disconnect = useReceiveMessage(
        receiverUser.username,
        receiveMessageSubscribe,
        updateChatHistory
      );
      return () => {
        disconnect();
      };
    }, []);

    const handleOpenChatModal = () => {
      setChatOpen(true);
    };

    const handleCloseChatModal = () => {
      setChatOpen(false);
    };

    const onUserSend = useCallback(
      (message: string) => {
        const wrapMessage = (message: string): Message => {
          return {
            message: message,
            date: new Date(),
            username: currentUsername,
          };
        };
        const newMessage = wrapMessage(message);
        handleSendMessage(receiverUser.username, newMessage);
        AddMessageToHistory(newMessage);
      },
      [
        AddMessageToHistory,
        currentUsername,
        handleSendMessage,
        receiverUser.username,
      ]
    );
    if (!chatOpen)
      return (
        <Rnd
          minWidth={80}
          minHeight={80}
          bounds="window"
          enableResizing={false}
        >
          <ChatCircle
            className={cx(cls.ChatModal, {}, [className])}
            onClick={handleOpenChatModal}
          />
        </Rnd>
      );

    return (
      <Rnd
        default={{
          x: 150,
          y: 205,
          width: 365,
          height: 280,
        }}
        minWidth={365}
        minHeight={280}
        bounds="window"
      >
        <Chat
          className={cx(cls.ChatModal, {}, [className])}
          handleSendMessage={onUserSend}
          currentUsername={currentUsername}
          messageHistory={messageHistory}
          receiverUsername={receiverUser.username}
          onClose={() => handleCloseModal(receiverUser._id)}
          onCollapse={handleCloseChatModal}
        />
      </Rnd>
    );
  }
);
