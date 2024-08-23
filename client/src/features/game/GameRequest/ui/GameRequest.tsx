import cls from "./GameRequest.module.scss";
import { Card, HStack, UiButton, VStack } from "@/shared/ui";

export const GameRequest = ({
  className,
  inviteData,
  handleYesButton,
  handleNoButton,
}: {
  className?: string;
  inviteData: {
    senderUsername: string;
    gameName: string;
  };
  handleYesButton: ({
    opponentUsername,
    gameName,
  }: {
    opponentUsername: string;
    gameName: string;
  }) => void;
  handleNoButton: () => void;
}) => {
  const handleStartGame = () => {
    console.log(inviteData);
    console.log(inviteData);

    handleYesButton({
      opponentUsername: inviteData.senderUsername,
      gameName: inviteData.gameName,
    });
  };

  const handleRejectGame = () => {
    //    handleNoButton();
  };

  return (
    <Card className={`${cls.GameRequest} ${className}`}>
      <VStack>
        <div>
          {inviteData.senderUsername} wants to play {inviteData.gameName} with you.
          Do you accept?
        </div>
        <HStack>
          <UiButton onClick={handleStartGame}>Yes</UiButton>
          <UiButton onClick={handleRejectGame}>No</UiButton>
        </HStack>
      </VStack>
    </Card>
  );
};
