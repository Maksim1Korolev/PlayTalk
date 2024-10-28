import cls from "./GameRequest.module.scss";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { Rnd } from "react-rnd";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SkipNextIcon from "@mui/icons-material/SkipNext";

import { useAppDispatch, useAppSelector, useModalDrag } from "@/shared/lib";
import { AddonCircle, AppImage, AppImageProps, UiButton } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import { getInvites, Invite, inviteActions } from "@/entities/game/Invite";
import { getUsers, User, userActions } from "@/entities/User";

interface GameRequestProps {
  className?: string;
  position?: { x: number; y: number };
}

export const GameRequest = ({ className, position }: GameRequestProps) => {
  const dispatch = useAppDispatch();
  const invites = Object.values(useAppSelector(getInvites));
  const users = useAppSelector(getUsers);

  const [currentInviteIndex, setCurrentInviteIndex] = useState(0);
  const currentInvite = invites[currentInviteIndex] || null;

  const { isDragged, handleDragStart, handleDragStop } = useModalDrag();
  const [iconMap, setIconMap] = useState<{ [key: string]: string }>({});
  const [avatarMap, setAvatarMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadIcons = async () => {
      const iconPaths: { [key: string]: string } = {};
      const avatarPaths: { [key: string]: string } = {};

      for (const invite of invites) {
        const { gameName, senderUsername } = invite;

        const iconPath = getImagePath({
          collection: "gameIcons",
          fileName: gameName,
        });
        iconPaths[gameName] = iconPath;

        const inviteUser = users.find(
          (user: User) => user.username === senderUsername
        );
        if (inviteUser?.avatarFileName) {
          const avatarPath = getImagePath({
            collection: "avatars",
            fileName: inviteUser.avatarFileName,
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
  }, [users]);

  const updateInvitingStatus = useCallback(
    (senderUsername: string, isInviting: boolean) => {
      dispatch(
        userActions.updateUser({
          username: senderUsername,
          updatedProps: { isInviting },
        })
      );
    },
    [dispatch]
  );

  const handleAcceptGameInvite = useCallback(
    (invite: Invite) => {
      const inviteKey = `${invite.senderUsername}:${invite.gameName}`;
      dispatch(inviteActions.removeInvite(inviteKey));
      updateInvitingStatus(invite.senderUsername, false);
    },
    [dispatch]
  );

  const handleRejectGameInvite = useCallback(
    (invite: Invite) => {
      const inviteKey = `${invite.senderUsername}:${invite.gameName}`;
      dispatch(inviteActions.removeInvite(inviteKey));
      updateInvitingStatus(invite.senderUsername, false);
    },
    [dispatch, updateInvitingStatus]
  );

  const handleYesButtonClick = () => {
    if (!isDragged && currentInvite) {
      handleAcceptGameInvite(currentInvite);
    }
  };

  const handleNoButtonClick = () => {
    if (!isDragged && currentInvite) {
      handleRejectGameInvite(currentInvite);
    }
  };

  const handleSkipButtonClick = () => {
    setCurrentInviteIndex(prevIndex =>
      prevIndex < invites.length - 1 ? prevIndex + 1 : 0
    );
  };

  const getInviteCircle = (): ReactNode => {
    const gameIconSize = 80;
    const avatarIconSize = 36;

    const gameIconUrl = iconMap[currentInvite?.gameName || ""];
    const avatarIconUrl = avatarMap[currentInvite?.senderUsername || ""];

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

  if (!currentInvite) return null;

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

  if (invites.length === 0) return null;

  return <Rnd {...rndProps}>{getInviteCircle()}</Rnd>;
};
