import cls from "./GameRequest.module.scss";
import { Card, HStack, UiButton, VStack } from "@/shared/ui";

export const GameRequest = ({
  className,
  senderUsername,
  handleYesButton,
  handleNoButton,
}: {
  className?: string;
  senderUsername: string;
  handleYesButton: () => void;
  handleNoButton: ({
    senderUsername,
    receiverUsername,
    areBusy,
  }: {
    senderUsername?: string;
    receiverUsername: string;
    areBusy?: boolean;
  }) => void;
}) => {
  const handleStartGame = () => {};

  const handleRejectGame = () => {
    handleNoButton({ receiverUsername: senderUsername, areBusy: false });
  };

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
