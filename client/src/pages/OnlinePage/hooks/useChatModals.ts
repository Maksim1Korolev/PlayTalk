import { User } from "@/entities/User";
import { Message } from "@/features/Chat/ui/ChatMessage/ui/ChatMessage";
import { onlineSocket } from "@/shared/api/sockets";
import { useCallback, useEffect } from "react";

export interface ChatModalStateProps {
  user: User;
  position?: {
    x: number;
    y: number;
  };
}

export const useChatModals = (currentUser: User) => {
  const handleUserMessage = useCallback(
    (receiverUsername: string, message: Message) => {
      console.log(receiverUsername);

      onlineSocket.emit("send-message", {
        senderUsername: currentUser.username,
        receiverUsername,
        message,
      });
    },
    [currentUser.username]
  );

  const readAllUnreadMessages = useCallback(
    (usernames: string[]) => {
      onlineSocket.emit("on-read-messages", {
        requestingUsername: currentUser.username,
        usernames,
      });
    },
    [currentUser.username]
  );

  return {
    handleUserMessage,
    readAllUnreadMessages,
  };
};

export const useReceiveMessage = (
  currentReceiverUsername: string,
  addMessagesToHistory: (messages: Message[]) => void
) => {
  useEffect(() => {
    const updateChatHistory = (
      messages: Message[],
      receiverUsername: string
    ) => {
      console.log(messages);

      if (currentReceiverUsername === receiverUsername) {
        addMessagesToHistory(messages);
      }
    };

    const receiveMessageSubscribe = ({
      senderUsername,
      message,
    }: {
      senderUsername: string;
      message: Message;
    }) => {
      if (senderUsername === currentReceiverUsername) {
        addMessagesToHistory([message]);
      }
    };

    onlineSocket.emit("on-chat-open", currentReceiverUsername);

    onlineSocket.on("update-chat", updateChatHistory);
    onlineSocket.on("receive-message", receiveMessageSubscribe);

    return () => {
      onlineSocket.off("update-chat", updateChatHistory);
      onlineSocket.off("receive-message", receiveMessageSubscribe);
    };
  }, [addMessagesToHistory, currentReceiverUsername]);
};
