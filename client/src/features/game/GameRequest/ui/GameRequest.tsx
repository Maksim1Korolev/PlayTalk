import cls from "./GameRequest.module.scss";

import { memo, useCallback, useContext } from "react";
import { Rnd } from "react-rnd";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SkipNextIcon from "@mui/icons-material/SkipNext";

import { useAppDispatch, useAppSelector, useModalDrag } from "@/shared/lib";
import { SocketContext } from "@/shared/lib/context/SocketContext";
import { AddonCircle, AppImage, AppImageProps, UiButton } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import { GameName, GameStatus } from "@/entities/game/Game";
import {
  acceptGameInvite,
  Invite,
  inviteActions,
} from "@/entities/game/Invite";
import { getUsers, userActions } from "@/entities/User";

interface GameRequestProps {
  className?: string;
  position?: { x: number; y: number };
}

export const GameRequest = memo(({ className, position }: GameRequestProps) => {
  const dispatch = useAppDispatch();
  const currentInvite: Invite | undefined = useAppSelector(
    (state) => state.invite.currentInvite
  );
  const { sockets } = useContext(SocketContext);
  const { gameSocket } = sockets;
  const users = useAppSelector(getUsers);

  const currentInviteAvatarSrc = currentInvite
    ? users[currentInvite.senderUsername]?.avatarFileName
    : undefined;

  const { isDragged, handleDragStart, handleDragStop } = useModalDrag();

  //TODO:Move
  const updateGameStatusMap = useCallback(
    (
      username: string,
      gameName: GameName,
      statusUpdate: Partial<GameStatus>
    ) => {
      const user = users[username];

      const currentGameStatusMap = (user?.gameStatusMap ?? {}) as Record<
        GameName,
        GameStatus
      >;

      const currentGameStatus = currentGameStatusMap[gameName] ?? {};

      const updatedGameStatusMap: Record<GameName, GameStatus> = {
        ...currentGameStatusMap,
        [gameName]: {
          ...currentGameStatus,
          ...statusUpdate,
        },
      };

      dispatch(
        userActions.updateUser({
          username,
          updatedProps: {
            gameStatusMap: updatedGameStatusMap,
          },
        })
      );
    },
    [dispatch, users]
  );

  const handleAcceptGameInvite = () => {
    if (currentInvite && !isDragged) {
      dispatch(acceptGameInvite({ gameSocket, invite: currentInvite }));
      updateGameStatusMap(
        currentInvite.senderUsername,
        currentInvite.gameName,
        {
          hasInvitation: false,
        }
      );
    }
  };

  const handleRejectGameInvite = () => {
    if (currentInvite && !isDragged) {
      dispatch(inviteActions.removeInvite(currentInvite));
      updateGameStatusMap(
        currentInvite.senderUsername,
        currentInvite.gameName,
        {
          hasInvitation: false,
        }
      );
    }
  };

  const handleSkipButtonClick = () => {
    dispatch(inviteActions.skipInvite());
  };

  const gameIconSize = 80;
  const avatarIconSize = 36;

  const gameIconUrl = currentInvite
    ? getImagePath({
        collection: "gameIcons",
        fileName: currentInvite.gameName,
      })
    : "";
  const avatarIconUrl = currentInviteAvatarSrc
    ? getImagePath({
        collection: "avatars",
        fileName: currentInviteAvatarSrc,
      })
    : "";

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

  const yesButton = (
    <UiButton
      variant="clear"
      onClick={handleAcceptGameInvite}
      className={cls.yesButton}
    >
      <CheckIcon />
    </UiButton>
  );

  const noButton = (
    <UiButton
      variant="clear"
      onClick={handleRejectGameInvite}
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

  return (
    currentInvite && (
      <Rnd {...rndProps}>
        <AddonCircle
          className={`${cls.GameRequest} ${className}`}
          iconProps={gameIconProps}
          addonTopRight={<AppImage {...avatarIconProps} />}
          addonBottomLeft={yesButton}
          addonBottomRight={noButton}
          addonTopLeft={skipButton}
        />
      </Rnd>
    )
  );
});
