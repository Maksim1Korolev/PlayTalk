import { Message } from "@/features/Chat/ui/ChatMessage/ui/ChatMessage";
import { useCallback, useState } from "react";

export const useModalMessages = ({
  currentUsername,
  receiverUsername,
  handleSendMessage,
}: {
  currentUsername: string;
  receiverUsername: string;
  handleSendMessage: (receiverUsername: string, message: Message) => void;
}) => {
  const [messageHistory, setMessageHistory] = useState<Message[]>();

  const addMessagesToHistory = useCallback((messages: Message[]) => {
    setMessageHistory(prev => [...(prev || []), ...messages]);
  }, []);

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
      handleSendMessage(receiverUsername, newMessage);
      addMessagesToHistory([newMessage]);
    },
    [addMessagesToHistory, currentUsername, handleSendMessage, receiverUsername]
  );
  return {
    messageHistory,
    onUserSend,
    addMessagesToHistory,
  };
};
