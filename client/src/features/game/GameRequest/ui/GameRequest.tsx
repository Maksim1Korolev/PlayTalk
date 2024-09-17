import cls from "./GameRequest.module.scss";
import { useState, useEffect, useContext, ReactNode } from "react";
import { Rnd } from "react-rnd";

import { AddonCircle, UiButton, SVGProps, AppSvg } from "@/shared/ui";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { useModalDrag } from "@/shared/hooks/useModalDrag";
import getImagePath from "@/shared/utils/getImagePath";
import { Invite } from "@/entities/Game/model";
import { User } from "@/entities/User";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SkipNextIcon from "@mui/icons-material/SkipNext";

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
  const [currentInviteIndex, setCurrentInviteIndex] = useState(0);
  const currentInvite = invites[currentInviteIndex] || null;

  const { isDragged, handleDragStart, handleDragStop } = useModalDrag();
  const { users } = useContext(UsersContext);

  const [iconSvgMap, setIconSvgMap] = useState<{
    [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  }>({});
  const [avatarIconMap, setAvatarIconMap] = useState<{
    [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  }>({});

  useEffect(() => {
    const loadIcons = async () => {
      const iconMap: {
        [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
      } = {};
      const avatarMap: {
        [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
      } = {};

      for (const invite of invites) {
        const { gameName, senderUsername } = invite;

        // Load game icon
        const iconPath = getImagePath({ gameName });
        try {
          const importedIcon = await import(iconPath);
          iconMap[gameName] = importedIcon.ReactComponent;
        } catch (error) {
          console.error(`Failed to load game icon: ${gameName}`, error);
        }

        // Load avatar icon
        const inviteUser = users.find(
          (user: User) => user.username === senderUsername
        );
        if (inviteUser?.avatarFileName) {
          const avatarPath = getImagePath({
            avatarFileName: inviteUser.avatarFileName,
          });

          try {
            const importedAvatar = await import(avatarPath);
            avatarMap[senderUsername] = importedAvatar.ReactComponent;
          } catch (error) {
            console.error(
              `Failed to load avatar for user: ${senderUsername}`,
              error
            );
          }
        }
      }

      setIconSvgMap(iconMap);
      setAvatarIconMap(avatarMap);
    };

    if (invites.length > 0) {
      loadIcons();
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

  const handleSkipButtonClick = () => {
    if (currentInviteIndex < invites.length - 1) {
      setCurrentInviteIndex(currentInviteIndex + 1);
    } else {
      setCurrentInviteIndex(0);
    }
  };

  const getInviteCircle = (): ReactNode => {
    const gameIcon = iconSvgMap[currentInvite.gameName];
    const avatarIcon = avatarIconMap[currentInvite.senderUsername];

    if (!gameIcon || !avatarIcon) return null;

    const gameIconProps: SVGProps = {
      Svg: gameIcon,
      width: 80,
      height: 80,
      highlight: "secondary",
    };

    const avatarIconProps: SVGProps = {
      Svg: avatarIcon,
      width: 30,
      height: 30,
    };

    return (
      <AddonCircle
        className={`${cls.GameRequest} ${className}`}
        iconProps={gameIconProps}
        addonTopRight={<AppSvg {...avatarIconProps} ref={undefined} />}
        addonBottomLeft={yesButton}
        addonBottomRight={noButton}
        addonTopLeft={skipButton}
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

  const skipButton = (
    <UiButton
      variant="clear"
      onClick={handleSkipButtonClick}
      className={cls.skipButton}
    >
      <SkipNextIcon />
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
    enableResizing: false,
  };

  return <Rnd {...rndProps}>{getInviteCircle()}</Rnd>;
};
