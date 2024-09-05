import cls from "./GameRequest.module.scss";
import { Card, HStack, UiButton, VStack } from "@/shared/ui";
import resources from "@/shared/assets/locales/en/games/GameRequestResources.json";

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
    handleYesButton({
      opponentUsername: inviteData.senderUsername,
      gameName: inviteData.gameName,
    });
  };

  const handleRejectGame = () => {
    handleNoButton();
  };

  return (
    <Card className={`${cls.GameRequest} ${className}`}>
      <VStack>
        <div>
          {resources.inviteMessage
            .replace("{senderUsername}", inviteData.senderUsername)
            .replace("{gameName}", inviteData.gameName)}
        </div>
        <HStack>
          <UiButton onClick={handleStartGame}>{resources.yesButton}</UiButton>
          <UiButton onClick={handleRejectGame}>{resources.noButton}</UiButton>
        </HStack>
      </VStack>
    </Card>
  );
};
