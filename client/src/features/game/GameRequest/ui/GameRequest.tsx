import { useState, useEffect } from "react";
import cls from "./GameRequest.module.scss";
import { Card, HStack, UiButton, VStack } from "@/shared/ui";
import resources from "@/shared/assets/locales/en/games/GameRequestResources.json";
import { Invite } from "@/entities/Game/model";

export const GameRequest = ({
  className,
  invites,
  handleYesButton,
  handleNoButton,
}: {
  className?: string;
  invites: Invite[];
  handleYesButton: (invite: Invite) => void;
  handleNoButton: (invite: Invite) => void;
}) => {
  const [currentInvite, setCurrentInvite] = useState<Invite | null>(null);

  useEffect(() => {
    if (invites.length > 0) {
      setCurrentInvite(invites[0]);
    } else {
      setCurrentInvite(null);
    }
  }, [invites]);

  const handleStartGame = () => {
    if (currentInvite) {
      handleYesButton(currentInvite);
    }
  };

  const handleRejectGame = () => {
    if (currentInvite) {
      handleNoButton(currentInvite);
    }
  };

  if (!currentInvite) {
    return null;
  }

  return (
    <Card className={`${cls.GameRequest} ${className}`}>
      <VStack>
        <div>
          {resources.inviteMessage
            .replace("{senderUsername}", currentInvite.senderUsername)
            .replace("{gameName}", currentInvite.gameName)}
        </div>
        <HStack>
          <UiButton onClick={handleStartGame}>{resources.yesButton}</UiButton>
          <UiButton onClick={handleRejectGame}>{resources.noButton}</UiButton>
        </HStack>
      </VStack>
    </Card>
  );
};
