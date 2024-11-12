import cls from "./UserListCard.module.scss";

import { useEffect, useRef } from "react";

import { cx } from "@/shared/lib";
import {
  AddonCircle,
  AppImage,
  AppImageProps,
  HStack,
  Skeleton,
  UiButton,
  UiText,
} from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import { UnreadMessagesCountIndicator } from "@/entities/Chat";
import { GameData, GameName } from "@/entities/game/Game";
import { User, UserOnlineIndicator } from "@/entities/User";
import { GameSelector } from "@/features/game";

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
      <HStack
        className={cls.userInfo}
        gap="16"
        max
        align="center"
        justify="center"
      >
        {
          //TODO: ref
        }
        <UiText className={cls.username} bold size="l">
          {user?.username}
        </UiText>
        <HStack className={cls.buttons} gap="8">
          <GameSelector
            className={cls.playButton}
            onSelectGame={onPlayButton}
            menuId={user?.username || ""}
          />
          <div className={cls.chatButtonBorder}>
            <UiButton
              className={cls.chatButton}
              onClick={onChatOpen}
              variant="clear"
            >
              <AppImage
                src={getImagePath({ collection: "appIcons", fileName: "chat" })}
                width={48}
                height={48}
              />
            </UiButton>
          </div>
        </HStack>
      </HStack>
    </HStack>
  );
};
