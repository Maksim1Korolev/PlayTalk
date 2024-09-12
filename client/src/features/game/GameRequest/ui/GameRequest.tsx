import { useState, useEffect, useContext } from "react";
import cls from "./GameRequest.module.scss";
import { Card, HStack, UiButton, VStack } from "@/shared/ui";
import resources from "@/shared/assets/locales/en/games/GameRequestResources.json";
import { Invite } from "@/entities/Game/model";
import { UsersContext } from "@/shared/lib/context/UsersContext";

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
  const { setUsers } = useContext(UsersContext);

  useEffect(() => {
    if (invites.length > 0) {
      const newInvite = invites[0];
      setCurrentInvite(newInvite);
    } else {
      setCurrentInvite(null);
    }
  }, [invites]);

  const handleYesButtonClick = () => {
    if (currentInvite) {
      handleYesButton(currentInvite);
    }
  };

  const handleNoButtonClick = () => {
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
          <UiButton onClick={handleYesButtonClick}>
            {resources.yesButton}
          </UiButton>
          <UiButton onClick={handleNoButtonClick}>
            {resources.noButton}
          </UiButton>
        </HStack>
      </VStack>
    </Card>
  );
};
