import { useCallback, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { chatApiService } from "@/shared/api";
import { SocketContext } from "@/shared/lib/context/SocketContext";

import { Message } from "@/entities/Chat";

export const useChatMessages = ({
  currentUsername,
  recipientUsername,
}: {
  currentUsername: string;
  recipientUsername: string;
}) => {
  const [cookies] = useCookies();
  //TODO:Possibly get currentUsername from here too
  const { token } = cookies["jwt-cookie"];

  const { sockets } = useContext(SocketContext);
  const { communicationSocket } = sockets;

  const [messageHistory, setMessageHistory] = useState<Message[]>([]);

  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        const initialMessages = await chatApiService.getMessageHistory(
          recipientUsername,
          token
        );
        setMessageHistory(initialMessages);
      } catch (error) {
        console.error("Failed to load message history:", error);
      }
    };

    loadInitialMessages();
  }, [recipientUsername, token]);

  const readAllUnreadMessages = useCallback(
    (usernames: string[]) => {
      if (!communicationSocket) return;
      communicationSocket.emit("on-read-messages", {
        usernames,
      });
    },
    [communicationSocket]
  );

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
        recipientUsername,
        message: newMessage,
      });
    },
    [communicationSocket, currentUsername, recipientUsername]
  );

  useEffect(() => {
    if (!communicationSocket) return;

    communicationSocket.on("typing", senderUsername => {
      if (senderUsername === recipientUsername) setIsTyping(true);
    });
    communicationSocket.on("stop-typing", senderUsername => {
      if (senderUsername === recipientUsername) setIsTyping(false);
    });

    return () => {
      communicationSocket.off("typing");
      communicationSocket.off("stop-typing");
    };
  }, [communicationSocket, recipientUsername]);

  useEffect(() => {
    const onReceiveMessage = (message: Message) => {
      if (message.username === recipientUsername) {
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
  }, [communicationSocket, recipientUsername]);

  const notifyTyping = useCallback(() => {
    if (!communicationSocket) return;

    if (!typing) {
      setTyping(true);
      communicationSocket.emit("typing", recipientUsername);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        if (communicationSocket) {
          communicationSocket.emit("stop-typing", recipientUsername);
        }
        setTyping(false);
      }
    }, timerLength);

    communicationSocket.emit("typing", recipientUsername);
  }, [communicationSocket, recipientUsername, typing]);

  return {
    messageHistory,
    sendMessage,
    readAllUnreadMessages,
    isTyping,
    notifyTyping,
  };
};
