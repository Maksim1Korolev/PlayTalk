import { useState, useEffect, useContext } from "react";
import cls from "./GameRequest.module.scss";
import { Card, HStack, UiButton, VStack } from "@/shared/ui";
import resources from "@/shared/assets/locales/en/games/GameRequestResources.json";
import { Invite } from "@/entities/Game/model";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { useModalDrag } from "@/shared/hooks/useModalDrag";
import { Rnd } from "react-rnd";

interface GameRequestProps {
  className?: string;
  position?: { x: number; y: number };
  invites: Invite[];
  handleYesButton: (invite: Invite) => void;
  handleNoButton: (invite: Invite) => void;
}

export const GameRequest = ({
  className,
  position,
  invites,
  handleYesButton,
  handleNoButton,
}: GameRequestProps) => {
  const [currentInvite, setCurrentInvite] = useState<Invite | null>(null);
  const { isDragged, handleDragStart, handleDragStop } = useModalDrag();
  const { users } = useContext(UsersContext);

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
    <Rnd
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      default={{
        x: position?.x || 0,
        y: position?.y || 0,
        width: 80,
        height: 80,
      }}
      //TODO:Move to constants
      minWidth={80}
      minHeight={80}
      bounds="window"
    >
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
    </Rnd>
  );
};
