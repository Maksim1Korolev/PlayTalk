import { User } from "@/entities/User";
import { Message } from "@/features/Chat/ui/ChatMessage/ui/ChatMessage";
import { onlineSocket } from "@/shared/api/sockets";
import { useCallback } from "react";

export interface ChatModalStateProps {
  user: User;
}

export const useChatModals = (currentUser: User) => {
  const handleUserMessage = useCallback(
    (receiverUsername: string, message: Message) => {
      onlineSocket.emit("send-message", {
        senderUsername: currentUser.username,
        receiverUsername,
        message,
      });
    },
    [currentUser.username]
  );

  return {
    handleUserMessage,
  };
};

export const useReceiveMessage = (
  receiverUsername: string,
  receiveMessage: ({
    senderUsername,
    message,
  }: {
    senderUsername: string;
    message: Message;
  }) => void,
  updateChatHistory: (messages: Message[], receiverUsername: string) => void
) => {
  onlineSocket.emit("on-chat-open", receiverUsername);
  onlineSocket.on("update-chat", updateChatHistory);
  onlineSocket.on("receive-message", receiveMessage);

  return () => {
    onlineSocket.off("update-chat", updateChatHistory);
    onlineSocket.off("receive-message", receiveMessage);
  };
};
