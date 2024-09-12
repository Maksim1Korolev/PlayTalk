import { useState, useEffect, useContext, ReactNode } from "react";
import cls from "./GameRequest.module.scss";
import { AddonCircle, UiButton, SVGProps } from "@/shared/ui";
import resources from "@/shared/assets/locales/en/games/GameRequestResources.json";
import { Invite } from "@/entities/Game/model";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { useModalDrag } from "@/shared/hooks/useModalDrag";
import { Rnd } from "react-rnd";
import getImagePath from "@/shared/utils/getImagePath";
import { User } from "@/entities/User";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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

  const getInviteCircle = (invite: Invite): ReactNode => {
    const AvatarComponent = avatarIconMap[invite.senderUsername];
    if (!AvatarComponent) return null;

    const svgProps: SVGProps = {
      Svg: AvatarComponent,
      width: 80,
      height: 80,
      highlight: "secondary",
    };

    return (
      <AddonCircle
        className={`${cls.GameRequest} ${className}`}
        iconProps={svgProps}
        addonBottomLeft={yesButton}
        addonBottomRight={noButton}
      />
    );
  };

  const yesButton = (
    <UiButton
      variant="clear"
      onClick={handleYesButtonClick}
      className={cls.yesButton}
    >
      <CheckIcon />
    </UiButton>
  );

  const noButton = (
    <UiButton
      variant="clear"
      onClick={handleNoButtonClick}
      className={cls.noButton}
    >
      <CloseIcon />
    </UiButton>
  );

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

  return <Rnd {...rndProps}>{getInviteCircle(currentInvite)}</Rnd>;
};
