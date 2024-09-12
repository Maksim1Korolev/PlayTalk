import { Message } from "@/features/Chat/ui/ChatMessage/ui/ChatMessage";
import { communicationSocket } from "@/shared/api/sockets";
import { useCallback, useEffect, useState } from "react";

export const useChatMessages = ({
  currentUsername,
  receiverUsername,
}: {
  currentUsername: string;
  receiverUsername: string;
}) => {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(
    (message: string) => {
      const newMessage: Message = {
        message,
        date: new Date(),
        username: currentUsername,
      };
      setMessageHistory(prev => [...prev, newMessage]);
    },
    [currentUsername]
  );

  const readAllUnreadMessages = useCallback((usernames: string[]) => {
    communicationSocket.emit("on-read-messages", {
      usernames,
    });
  }, []);

  useEffect(() => {
    const onReceiveMessage = (message: Message) => {
      if (message.username === receiverUsername) {
        setMessageHistory(prev => [...prev, message]);
        setIsTyping(false);
      }
    };

    communicationSocket.on("receive_message", onReceiveMessage);
    return () => {
      communicationSocket.off("receive_message", onReceiveMessage);
    };
  }, [receiverUsername]);

  const notifyTyping = useCallback(() => {
    communicationSocket.emit("typing", receiverUsername);
    setIsTyping(true);
  }, [receiverUsername]);

  return {
    messageHistory,
    sendMessage,
    readAllUnreadMessages,
    isTyping,
    notifyTyping,
  };
};
