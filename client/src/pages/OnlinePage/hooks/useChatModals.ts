import { User } from "@/entities/User";
import { Message } from "@/features/Chat/ui/ChatMessage/ui/ChatMessage";
import { communicationSocket } from "@/shared/api/sockets";
import { useCallback, useEffect } from "react";

export interface ChatModalStateProps {
  user: User;
  position?: {
    x: number;
    y: number;
  };
}

export const useChatModals = () => {
  const handleUserMessage = useCallback(
    (receiverUsername: string, message: Message) => {
      communicationSocket.emit("send-message", {
        receiverUsername,
        message,
      });
    },
    []
  );

  const readAllUnreadMessages = useCallback((usernames: string[]) => {
    communicationSocket.emit("on-read-messages", {
      usernames,
    });
  }, []);

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
      if (currentReceiverUsername === receiverUsername) {
        addMessagesToHistory(messages);
      }
    };

    const receiveMessageSubscribe = ({
      username,
      message,
    }: {
      username: string;
      message: Message;
    }) => {
      if (username === currentReceiverUsername) {
        addMessagesToHistory([message]);
      }
    };

    communicationSocket.emit("on-chat-open", currentReceiverUsername);

    communicationSocket.on("update-chat", updateChatHistory);
    communicationSocket.on("receive-message", receiveMessageSubscribe);

    return () => {
      communicationSocket.off("update-chat", updateChatHistory);
      communicationSocket.off("receive-message", receiveMessageSubscribe);
    };
  }, [addMessagesToHistory, currentReceiverUsername]);
};
