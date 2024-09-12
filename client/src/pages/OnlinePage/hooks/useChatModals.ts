import { User } from "@/entities/User";
import { Message } from "@/features/Chat/ui/ChatMessage/ui/ChatMessage";
import { communicationSocket } from "@/shared/api/sockets";
import { useCallback, useEffect, useState } from "react";

export interface ChatModalState {
  user: User;
  position: { x: number; y: number };
}
export const useChatModals = () => {
  const [chatModals, setChatModals] = useState<ChatModalState[]>([]);
  const openChatModal = useCallback((user: User) => {
    setChatModals(prev => [
      ...prev,
      { user, position: { x: 100, y: 100 } }, // default position
    ]);
  }, []);

  const closeChatModal = useCallback((userId: string) => {
    setChatModals(prev => prev.filter(modal => modal.user._id !== userId));
  }, []);
 

  return { chatModals, openChatModal, closeChatModal,  };
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
      if (senderUsername === currentReceiverUsername) setIsTyping(true);
    });

    return () => {
      communicationSocket.off("update-chat", updateChatHistory);
      communicationSocket.off("receive-message", receiveMessageSubscribe);
    };
  }, [addMessagesToHistory, currentReceiverUsername, setIsTyping]);
};
