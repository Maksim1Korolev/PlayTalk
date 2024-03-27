import { useEffect } from "react";
import { chatSocket } from "../../../shared/api/sockets";

interface UseChatSocketParams {
  currentUsername: string;
  receiverUsername: string;
  printMessage: ({
    senderUsername,
    message,
  }: {
    senderUsername: string;
    message: string;
  }) => void;
}

export const useChatSocket = ({
  currentUsername,
  receiverUsername,
  printMessage,
}: UseChatSocketParams): {
  handleUserMessage: (message: string) => void;
  requestChat: () => void;
} => {
  useEffect(() => {
    /////////////////////////////////////////////////////
    chatSocket.on("receive-message", (data) => {
      console.log(data + "receive start");

      if (data.senderUsername && data.message) {
        printMessage(data);
        console.log(data);
      }
    });

    chatSocket.on("chat-request-received", ({ senderUsername }) => {
      console.log(`${senderUsername} wants to chat with you.`);
      // You could also automatically accept the chat or show a notification to the user here
    });
    /////////////////////////////////////////////////////

    chatSocket.emit("join-chat-lobby", {
      senderUsername: currentUsername,
      receiverUsername,
    });

    return () => {
      chatSocket.close();
    };
  }, []);

  const handleUserMessage = (message: string) => {
    chatSocket.emit("send-message", {
      senderUsername: currentUsername,
      receiverUsername,
      message,
    });
  };

  const requestChat = () => {
    chatSocket.emit("request-chat", {
      senderUsername: currentUsername,
      receiverUsername,
    });
  };

  return {
    handleUserMessage,
    requestChat,
  };
};
