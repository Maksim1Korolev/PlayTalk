import { useState, useEffect, useContext, ReactNode } from "react";
import cls from "./GameRequest.module.scss";
import {
  AddonCircle,
  Card,
  HStack,
  UiButton,
  VStack,
  SVGProps,
} from "@/shared/ui";
import resources from "@/shared/assets/locales/en/games/GameRequestResources.json";
import { Invite } from "@/entities/Game/model";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { useModalDrag } from "@/shared/hooks/useModalDrag";
import { Rnd } from "react-rnd";
import getImagePath from "@/shared/utils/getImagePath";
import { User } from "@/entities/User";

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

  const [avatarIconMap, setAvatarIconMap] = useState<{
    [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  }>({});

  useEffect(() => {
    const loadAvatars = async () => {
      const avatarMap: {
        [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
      } = {};

      for (const invite of invites) {
        const inviteUser = users.find(
          (user: User) => user.username === invite.senderUsername
        );
        if (inviteUser && inviteUser.avatarFileName) {
          const avatarPath = getImagePath({
            avatarFileName: inviteUser.avatarFileName,
          });

          try {
            const importedAvatar = await import(avatarPath);
            avatarMap[invite.senderUsername] = importedAvatar.ReactComponent;
          } catch (error) {
            console.error(
              `Failed to load avatar for user: ${invite.senderUsername}`,
              error
            );
          }
        }
      }

      setAvatarIconMap(avatarMap);
    };

    if (invites.length > 0) {
      setCurrentInvite(invites[0]);
      loadAvatars();
    } else {
      setCurrentInvite(null);
    }
  }, [invites, users]);

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

  const renderAvatarIcon = (username: string): ReactNode => {
    const AvatarComponent = avatarIconMap[username];
    if (!AvatarComponent) return null;

    const svgProps: SVGProps = {
      Svg: AvatarComponent,
      width: 80,
      height: 80,
      highlight: "secondary",
    };

    return <AddonCircle iconProps={svgProps} />;
  };

  if (!currentInvite) {
    return null;
  }

  const rndProps = {
    onDragStart: handleDragStart,
    onDragStop: handleDragStop,
    default: {
      x: position?.x || 300,
      y: position?.y || 300,
      width: 80,
      height: 80,
    },
    minWidth: 80,
    minHeight: 80,
    bounds: "window",
  };

  return (
    <Rnd {...rndProps}>
      <Card className={`${cls.GameRequest} ${className}`}>
        <VStack>
          <div>
            {resources.inviteMessage
              .replace("{senderUsername}", currentInvite.senderUsername)
              .replace("{gameName}", currentInvite.gameName)}
          </div>
          {renderAvatarIcon(currentInvite.senderUsername)}
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
