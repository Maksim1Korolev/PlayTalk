import { User } from "@/entities/User";
import { Message } from "@/features/Chat/ui/ChatMessage/ui/ChatMessage";
import { useCallback, useEffect, useContext } from "react";
import { SocketContext } from "@/shared/lib/context/SocketContext";

export interface ChatModalStateProps {
  user: User;
  position?: {
    x: number;
    y: number;
  };
}

export const useChatModals = () => {
  const { sockets } = useContext(SocketContext);
  const { communicationSocket } = sockets;

  const handleUserMessage = useCallback(
    (receiverUsername: string, message: Message) => {
      if (communicationSocket) {
        communicationSocket.emit("send-message", {
          receiverUsername,
          message,
        });
      }
    },
    [communicationSocket]
  );

  const readAllUnreadMessages = useCallback(
    (usernames: string[]) => {
      if (communicationSocket) {
        communicationSocket.emit("on-read-messages", {
          usernames,
        });
      }
    },
    [communicationSocket]
  );

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
  const { sockets } = useContext(SocketContext);
  const { communicationSocket } = sockets;

  useEffect(() => {
    if (communicationSocket) {
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

      communicationSocket.emit("on-chat-open", {
        receiverUsername: currentReceiverUsername,
      });

      communicationSocket.on("update-chat", updateChatHistory);
      communicationSocket.on("receive-message", receiveMessageSubscribe);
      communicationSocket.on("typing", senderUsername => {
        if (senderUsername === currentReceiverUsername) setIsTyping(true);
      });
      communicationSocket.on("stop typing", senderUsername => {
        if (senderUsername === currentReceiverUsername) setIsTyping(false);
      });

      return () => {
        communicationSocket.off("update-chat", updateChatHistory);
        communicationSocket.off("receive-message", receiveMessageSubscribe);
        communicationSocket.off("typing");
        communicationSocket.off("stop typing");
      };
    }
  }, [
    addMessagesToHistory,
    currentReceiverUsername,
    communicationSocket,
    setIsTyping,
  ]);
};
