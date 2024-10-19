import cls from "./GameRequest.module.scss";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Rnd } from "react-rnd";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SkipNextIcon from "@mui/icons-material/SkipNext";

import { AddonCircle, UiButton, AppImage, AppImageProps } from "@/shared/ui";
import { UserContext } from "@/shared/lib/context/UserContext";
import { useModalDrag } from "@/shared/lib";
import getImagePath from "@/shared/utils/getImagePath";
import { Invite } from "@/entities/Game/model";
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
  const [currentInviteIndex, setCurrentInviteIndex] = useState(0);
  const currentInvite = invites[currentInviteIndex] || null;

  const { isDragged, handleDragStart, handleDragStop } = useModalDrag();
  const { users } = useContext(UserContext);

  const [iconMap, setIconMap] = useState<{ [key: string]: string }>({});
  const [avatarMap, setAvatarMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadIcons = async () => {
      const iconPaths: { [key: string]: string } = {};
      const avatarPaths: { [key: string]: string } = {};

      for (const invite of invites) {
        const { gameName, senderUsername } = invite;

        const iconPath = getImagePath({ gameName });
        iconPaths[gameName] = iconPath;

        const inviteUser = users.find(
          (user: User) => user.username === senderUsername
        );
        if (inviteUser?.avatarFileName) {
          const avatarPath = getImagePath({
            avatarFileName: inviteUser.avatarFileName,
          });
          avatarPaths[senderUsername] = avatarPath;
        }
      }

      setIconMap(iconPaths);
      setAvatarMap(avatarPaths);
    };

    if (invites.length > 0) {
      loadIcons();
    }
  }, [invites, users]);

  const handleYesButtonClick = () => {
    if (!isDragged && currentInvite) {
      handleYesButton(currentInvite);
    }
  };

  const handleNoButtonClick = () => {
    if (!isDragged && currentInvite) {
      handleNoButton(currentInvite);
    }
  };

  const handleSkipButtonClick = () => {
    if (!isDragged && currentInviteIndex < invites.length - 1) {
      setCurrentInviteIndex(currentInviteIndex + 1);
    } else {
      setCurrentInviteIndex(0);
    }
  };

  const getInviteCircle = (): ReactNode => {
    const gameIconSize = 80;
    const avatarIconSize = 80;

    const gameIconUrl = iconMap[currentInvite.gameName];
    const avatarIconUrl = avatarMap[currentInvite.senderUsername];

    if (!gameIconUrl || !avatarIconUrl) return null;

    const gameIconProps: AppImageProps = {
      src: gameIconUrl,
      draggable: false,
      width: gameIconSize,
      height: gameIconSize,
      highlight: "secondary",
    };

    const avatarIconProps: AppImageProps = {
      src: avatarIconUrl,
      width: avatarIconSize,
      height: avatarIconSize,
      draggable: false,
    };

    return (
      <AddonCircle
        className={`${cls.GameRequest} ${className}`}
        iconProps={{ ...gameIconProps }}
        addonTopRight={<AppImage {...avatarIconProps} />}
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
