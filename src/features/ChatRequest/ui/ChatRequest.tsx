import { send } from "process";
import { Card, HStack, UiButton, VStack } from "../../../shared/ui";
import cls from "./ChatRequest.module.scss";

export const ChatRequest = ({
  className,
  senderUsername,
}: {
  className?: string;
  senderUsername: string;
}) => {
  const handleStartChat = () => {};
  const handleRejectChat = () => {};
  return (
    <Card className={`${cls.ChatRequest} ${className}`}>
      <VStack>
        <div>{senderUsername} wants to chat with you. Do you accept?</div>
        <HStack>
          <UiButton onClick={handleStartChat}>Yes</UiButton>
          <UiButton onClick={handleRejectChat}>No</UiButton>
        </HStack>
      </VStack>
    </Card>
  );
};
