import { Message } from "@/features/chat/ChatBox/ui/ChatMessage/ui/ChatMessage";
import { SocketContext } from "@/shared/lib/context/SocketContext";
import { useCallback, useContext, useEffect, useState } from "react";

export const useChatMessages = ({
  currentUsername,
  receiverUsername,
}: {
  currentUsername: string;
  receiverUsername: string;
}) => {
  const { sockets } = useContext(SocketContext);
  const { communicationSocket } = sockets;
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);

  const sendMessage = useCallback(
    (message: string) => {
      const newMessage: Message = {
        message,
        date: new Date(),
        username: currentUsername,
      };
      setMessageHistory(prev => [...prev, newMessage]);
      if (!communicationSocket) return;
      communicationSocket.emit("send-message", {
        receiverUsername,
        message: newMessage,
      });
    },
    [communicationSocket, currentUsername, receiverUsername]
  );

  const readAllUnreadMessages = useCallback(
    (usernames: string[]) => {
      if (!communicationSocket) return;
      communicationSocket.emit("on-read-messages", {
        usernames,
      });
    },
    [communicationSocket]
  );

  useEffect(() => {
    if (!communicationSocket) return;

    const updateChatHistory = (messages: Message[], senderUsername: string) => {
      console.log(messages);
      console.log("Updating chat history");

      if (receiverUsername === senderUsername) {
        setMessageHistory(messages);
      }
    };
    communicationSocket.emit("on-chat-open", {
      receiverUsername,
    });

    communicationSocket.on("update-chat", updateChatHistory);

    communicationSocket.on("typing", senderUsername => {
      if (senderUsername === receiverUsername) setIsTyping(true);
    });
    communicationSocket.on("stop typing", senderUsername => {
      if (senderUsername === receiverUsername) setIsTyping(false);
    });
  }, [communicationSocket, receiverUsername]);

  useEffect(() => {
    const onReceiveMessage = (message: Message) => {
      if (message.username === receiverUsername) {
        console.log(message);

        setMessageHistory(prev => [...prev, message]);
        setIsTyping(false);
      }
    };
    if (communicationSocket) {
      communicationSocket.on("receive-message", onReceiveMessage);
    }
    return () => {
      if (communicationSocket) {
        communicationSocket.off("receive-message", onReceiveMessage);
      }
    };
  }, [communicationSocket, receiverUsername]);

  const notifyTyping = useCallback(() => {
    if (!communicationSocket) return;

    if (!typing) {
      setTyping(true);
      communicationSocket.emit("typing", receiverUsername);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        if (communicationSocket) {
          communicationSocket.emit("stop typing", receiverUsername);
        }
        setTyping(false);
      }
    }, timerLength);

    communicationSocket.emit("typing", receiverUsername);
  }, [communicationSocket, receiverUsername, typing]);

  return {
    messageHistory,
    sendMessage,
    readAllUnreadMessages,
    isTyping,
    notifyTyping,
  };
};
