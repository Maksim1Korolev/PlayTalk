import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

import { useAppDispatch } from "@/shared/lib";
import { SocketContext } from "@/shared/lib/context/SocketContext";

import {
  chatActions,
  fetchMessages,
  markMessagesAsRead,
  Message,
  postMessage,
} from "@/entities/Chat";

export const useChatMessages = ({
  recipientUsername,
}: {
  recipientUsername: string;
}) => {
  const [cookies] = useCookies();
  const { token } = cookies["jwt-cookie"];
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { sockets } = useContext(SocketContext);
  const { communicationSocket } = sockets;

  const dispatch = useAppDispatch();

  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        dispatch(fetchMessages({ recipientUsername, token }));
      } catch (error) {
        console.error("Failed to load message history:", error);
      }
    };

    loadInitialMessages();
  }, [dispatch, recipientUsername, token]);

  const readAllUnreadMessages = useCallback(
    (usernames: string[]) => {
      dispatch(markMessagesAsRead({ usernames, communicationSocket }));
    },
    [communicationSocket, dispatch]
  );

  const sendMessage = useCallback(
    (message: string) => {
      dispatch(
        postMessage({
          recipientUsername,
          message,
          communicationSocket,
        })
      );
    },
    [communicationSocket, dispatch, recipientUsername]
  );

  useEffect(() => {
    if (!communicationSocket) return;

    communicationSocket.on("typing", (senderUsername) => {
      if (senderUsername === recipientUsername)
        dispatch(
          chatActions.setIsTyping({ username: senderUsername, isTyping: true })
        );
    });

    communicationSocket.on("stop-typing", (senderUsername) => {
      if (senderUsername === recipientUsername)
        dispatch(
          chatActions.setIsTyping({ username: senderUsername, isTyping: false })
        );
    });

    return () => {
      communicationSocket.off("typing");
      communicationSocket.off("stop-typing");
    };
  }, [communicationSocket, dispatch, recipientUsername]);

  useEffect(() => {
    const onReceiveMessage = (message: Message) => {
      if (message.username === recipientUsername) {
        console.log(message);

        dispatch(
          chatActions.addMessage({ username: recipientUsername, message })
        );
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
  }, [communicationSocket, dispatch, recipientUsername]);

  const notifyTyping = useCallback(() => {
    if (!communicationSocket) return;

    if (!typing) {
      setTyping(true);
      communicationSocket.emit("typing", recipientUsername);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const timerLength = 3000;
    typingTimeoutRef.current = setTimeout(() => {
      if (typing) {
        communicationSocket.emit("stop-typing", recipientUsername);
        setTyping(false);
      }
      typingTimeoutRef.current = null;
    }, timerLength);
  }, [communicationSocket, recipientUsername, typing]);

  return {
    sendMessage,
    readAllUnreadMessages,
    notifyTyping,
  };
};
