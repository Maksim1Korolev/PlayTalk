import cls from "./UserListCard.module.scss";

import { cx } from "@/shared/lib";
import { AddonCircle, AppImageProps, HStack } from "@/shared/ui";
import { Skeleton } from "@/shared/ui/Skeleton";
import getImagePath from "@/shared/utils/getImagePath";

import { UnreadMessagesCountIndicator } from "@/entities/Chat";
import { GameData, GameName, PlayButton } from "@/entities/game/Game";
import { User } from "@/entities/User";

import { UserOnlineIndicator } from "../../UserOnlineIndicator";

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
  userRef?: (el: HTMLSpanElement | null) => void;
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
  userRef?: (el: HTMLSpanElement | null) => void;
}

type UserListCard = UserListCardProps | UserListCardLoading;

export const UserListCard = ({
  className = "",
  user,
  collapsed = false,
  isLoading = false,
  handlePlayButton,
  handleChatButton,
  userRef,
}: UserListCard) => {
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
    const size = 50;

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
      <HStack className={cls.userInfo} max>
        <span className={cls.username} ref={userRef}>
          {user?.username}
        </span>

        <PlayButton
          highlight="none"
          className={cls.playButton}
          onSelectGame={onPlayButton}
          menuId={user?.username || ""}
        />
      </HStack>
    </HStack>
  );
};
