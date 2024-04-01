import { useState } from "react";
import { cx } from "@/shared/lib/cx";
import { Card, HStack, UiButton, UiInput, UiText, VStack } from "@/shared/ui";
import cls from "./Chat.module.scss";

export interface MessageHistory {
  message: string;
  date: Date;
  username: string;
}

export const Chat = ({
  className,
  messageHistory,
  handleSendMessage,
}: {
  className?: string;
  messageHistory?: MessageHistory[];
  handleSendMessage: (message: string) => void;
}) => {
  const [inputMessage, setInputMessage] = useState<string>("");

  const handleSendButton = () => {
    handleSendMessage(inputMessage);
    setInputMessage("");
  };

  return (
    <Card className={cx(cls.Chat, {}, [className])}>
      <VStack className={cls.messageLog}>
        {messageHistory?.map((message, index) => (
          <UiText key={index}>{message.message}</UiText>
        ))}
      </VStack>
      <HStack>
        <UiInput value={inputMessage} onChange={(e) => setInputMessage(e)} />
        <UiButton onClick={handleSendButton} />
      </HStack>
    </Card>
  );
};
