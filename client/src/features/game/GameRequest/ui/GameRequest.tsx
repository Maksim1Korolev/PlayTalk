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
    game: string;
  };
  handleYesButton: ({
    opponentUsername,
    game,
  }: {
    opponentUsername: string;
    game: string;
  }) => void;
  handleNoButton: () => void;
}) => {
  const handleStartGame = () => {
    console.log(inviteData);
    console.log(inviteData);

    handleYesButton({
      opponentUsername: inviteData.senderUsername,
      game: inviteData.game,
    });
  };

  const handleRejectGame = () => {
    //    handleNoButton();
  };

  return (
    <Card className={`${cls.GameRequest} ${className}`}>
      <VStack>
        <div>
          {inviteData.senderUsername} wants to play {inviteData.game} with you.
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
