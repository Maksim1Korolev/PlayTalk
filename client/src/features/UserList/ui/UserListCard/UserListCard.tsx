import cls from "./UserListCard.module.scss";

import { useEffect, useRef } from "react";

import { cx } from "@/shared/lib";
import {
  AddonCircle,
  AppImage,
  AppImageProps,
  HStack,
  UiButton,
  UiText,
} from "@/shared/ui";
import { Skeleton } from "@/shared/ui/Skeleton";
import getImagePath from "@/shared/utils/getImagePath";

import { UnreadMessagesCountIndicator } from "@/entities/Chat";
import { GameData, GameName, PlayButton } from "@/entities/game/Game";
import { User } from "@/entities/User";

import { UserOnlineIndicator } from "../../../../entities/User/ui/UserOnlineIndicator";

type UserListCardBase = {
  className?: string;
};

interface UserListCardProps extends UserListCardBase {
  className?: string;
  user: User;
  collapsed?: boolean;
  isLoading?: false;
  handlePlayButton?: ({
    gameData,
    isInviting,
    isActive,
  }: {
    gameData: GameData;
    isInviting: boolean;
    isActive: boolean;
  }) => void;
  handleChatButton?: (user: User) => void;
}

interface UserListCardLoading extends UserListCardBase {
  isLoading: true;
  user?: User;
  collapsed?: boolean;
  handlePlayButton?: ({
    gameData,
    isInviting,
    isActive,
  }: {
    gameData: GameData;
    isInviting: boolean;
    isActive: boolean;
  }) => void;
  handleChatButton?: (user: User) => void;
}

type UserListCard = UserListCardProps | UserListCardLoading;

export const UserListCard = ({
  className = "",
  user,
  collapsed = false,
  isLoading = false,
  handlePlayButton,
  handleChatButton,
}: UserListCard) => {
  const usernameRef = useRef<HTMLParagraphElement>(null);

  const adjustFontSize = (
    element: HTMLElement,
    maxWidth: number,
    minFontSize: number = 0.6
  ) => {
    let fontSize = parseFloat(window.getComputedStyle(element).fontSize);
    while (element.scrollWidth > maxWidth && fontSize > minFontSize) {
      fontSize -= 0.1;
      element.style.fontSize = `${fontSize}rem`;
    }
  };

  useEffect(() => {
    if (usernameRef.current) {
      adjustFontSize(usernameRef.current, 50);
    }
  }, [usernameRef]);

  if (isLoading)
    return (
      <HStack
        className={cx(cls.UserListCard, { [cls.collapsed]: collapsed }, [
          className,
        ])}
        gap="8"
        max
      >
        <Skeleton border="100%" height={50} width={50} />
        <Skeleton width={50} height={20} />
        <Skeleton border="100%" height={50} width={50} />
      </HStack>
    );

  const onChatOpen = () => {
    if (handleChatButton && user) {
      handleChatButton(user);
    }
  };

  const onPlayButton = (gameName: GameName) => {
    if (handlePlayButton && user) {
      handlePlayButton({
        gameData: {
          gameName,
          opponentUsername: user.username,
        },
        isInviting: user.isInviting || false,
        isActive: user.activeGames?.includes(gameName) || false,
      });
    }
  };

  const setIconProps = () => {
    const size = 70;

    const avatarSrc = getImagePath({
      collection: "avatars",
      fileName: user?.avatarFileName,
    });

    const iconProps: AppImageProps = {
      src: avatarSrc,
      width: size,
      height: size,
      alt: user?.username,
    };

    return iconProps;
  };

  return (
    <HStack
      className={cx(cls.UserListCard, { [cls.collapsed]: collapsed }, [
        className,
      ])}
      gap="8"
      max
    >
      <AddonCircle
        iconProps={setIconProps()}
        addonTopRight={<UserOnlineIndicator isOnline={user?.isOnline} />}
        addonBottomRight={
          <UnreadMessagesCountIndicator
            unreadMessagesCount={user?.unreadMessageCount}
          />
        }
        onClick={onChatOpen}
      />
      <HStack className={cls.userInfo} gap="16" max>
        <UiText className={cls.username} bold size="l" ref={usernameRef}>
          {user?.username}
        </UiText>
        <PlayButton
          highlight="none"
          className={cls.playButton}
          onSelectGame={onPlayButton}
          menuId={user?.username || ""}
        />
        <UiButton
          className={cls.playButton}
          onClick={onChatOpen}
          variant="clear"
        >
          <AppImage
            src={getImagePath({ collection: "appIcons", fileName: "chat" })}
            width={40}
            height={40}
          />
        </UiButton>
      </HStack>
    </HStack>
  );
};
