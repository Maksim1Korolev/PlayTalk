import { memo } from "react";
import cls from "./GameRequest.module.scss";
import { Card, HStack, UiButton, VStack } from "@/shared/ui";

export const GameRequest = ({
  className,
  senderUsername,
}: {
  className?: string;
  senderUsername: string;
}) => {
  const handleStartGame = () => {};
  const handleRejectGame = () => {};
  return (
    <Card className={`${cls.GameRequest} ${className}`}>
      <VStack>
        <div>{senderUsername} wants to play with you. Do you accept?</div>
        <HStack>
          <UiButton onClick={handleStartGame}>Yes</UiButton>
          <UiButton onClick={handleRejectGame}>No</UiButton>
        </HStack>
      </VStack>
    </Card>
  );
};
