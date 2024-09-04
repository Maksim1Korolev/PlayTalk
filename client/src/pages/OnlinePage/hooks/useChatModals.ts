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
      console.log(receiverUsername);

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
  addMessagesToHistory: (messages: Message[]) => void,
  setIsTyping: (isTyping: boolean) => void
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

    communicationSocket.emit("on-chat-open", {
      receiverUsername: currentReceiverUsername,
    });

    communicationSocket.on("update-chat", updateChatHistory);
    communicationSocket.on("receive-message", receiveMessageSubscribe);
    communicationSocket.on("typing", senderUsername => {
      if (senderUsername === currentReceiverUsername) setIsTyping(true);
    });
    communicationSocket.on("stop typing", senderUsername => {
      if (senderUsername === currentReceiverUsername) setIsTyping(true);
    });

    return () => {
      communicationSocket.off("update-chat", updateChatHistory);
      communicationSocket.off("receive-message", receiveMessageSubscribe);
    };
  }, [addMessagesToHistory, currentReceiverUsername, setIsTyping]);
};
