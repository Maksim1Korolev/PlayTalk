import { useState } from "react";
import { cx } from "../../../shared/lib/cx";
import {
  Card,
  HStack,
  UiButton,
  UiInput,
  UiText,
  VStack,
} from "../../../shared/ui";
import cls from "./Chat.module.scss";
interface MessageHistory {
  message: string;
  date: Date;
  username: string;
}

export const Chat = ({
  className,
  currentUsername,
  receiverUsername,
  handleSendMessage,
  onMessageReceived,
}: {
  className?: string;
  currentUsername: string;
  receiverUsername: string;
  onMessageReceived: (message: string) => void;
  handleSendMessage: (message: string) => void;
}) => {
  const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  const AddMessageToHistory = (username: string, message: string) => {
    const newMessage: MessageHistory = {
      message: message,
      date: new Date(),
      username: username,
    };
    setMessageHistory((prev) => ({
      ...prev,
      newMessage,
    }));
  };

  onMessageReceived = (message: string) => {
    AddMessageToHistory(receiverUsername, message);
  };

  const handleClickButton = () => {
    handleSendMessage(inputMessage);

    AddMessageToHistory(currentUsername, inputMessage);
    setInputMessage("");
  };

  return (
    <Card className={cx(cls.Chat, {}, [className])}>
      <VStack className={cls.messageLog}>
        {messageHistory.map((message) => (
          <UiText>{message.message}</UiText>
        ))}
      </VStack>
      <HStack>
        <UiInput value={inputMessage} onChange={(e) => setInputMessage(e)} />
        <UiButton onClick={handleClickButton} />
      </HStack>
    </Card>
  );
};
