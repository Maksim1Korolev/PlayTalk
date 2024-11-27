import cls from "./UserListCard.module.scss";

import { memo } from "react";

import { cx, useAppSelector } from "@/shared/lib";
import {
  AddonCircle,
  AppImage,
  HStack,
  Skeleton,
  UiButton,
  UiText,
} from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import { UnreadMessagesCountIndicator } from "@/entities/Chat";
import { GameData, GameName } from "@/entities/game/Game";
import { getUserAvatarUrl, User, UserOnlineIndicator } from "@/entities/User";
import { GameSelector } from "@/features/game";

type UserListCardBaseProps = {
  className?: string;
};

interface DefaultProps extends UserListCardBaseProps {
  className?: string;
  user: User;
  collapsed?: boolean;
  isLoading?: false;
  handlePlayButtonClicked: (gameData: GameData) => void;
  handleChatButtonClicked: (username: string) => void;
}

interface LoadingProps extends UserListCardBaseProps {
  isLoading: true;
  collapsed?: boolean;
}

type UserListCardProps = DefaultProps | LoadingProps;

export const UserListCard = memo((props: UserListCardProps) => {
  const { className = "", collapsed = false, isLoading = false } = props;

  if (isLoading) {
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
  }

  const { user, handlePlayButtonClicked, handleChatButtonClicked } =
    props as DefaultProps;

  const buttonSize = 60;
  const avatarSize = 80;
  const avatarUrl = useAppSelector(getUserAvatarUrl(user.username));

  const onChatOpen = () => {
    if (user) {
      handleChatButtonClicked(user.username);
    }
  };

  const onGameClicked = ({ gameName }: { gameName: GameName }) => {
    if (user) {
      handlePlayButtonClicked({ opponentUsername: user.username, gameName });
    }
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
        addonTopRight={<UserOnlineIndicator isOnline={user?.isOnline} />}
      >
        <AppImage
          src={avatarUrl}
          draggable={false}
          width={avatarSize}
          height={avatarSize}
          alt={user?.username}
        />
      </AddonCircle>
      <UiText className={cls.username} size="l" max title={user?.username}>
        {user?.username}
      </UiText>
      <HStack className={cls.buttons} gap="8">
        <AddonCircle
          addonTopRight={
            <UnreadMessagesCountIndicator
              className={cls.unread}
              unreadMessagesCount={user.unreadMessageCount}
            />
          }
        >
          <div className={cls.chatButtonBorder}>
            <UiButton
              className={cls.chatButton}
              onClick={onChatOpen}
              variant="clear"
            >
              <AppImage
                src={getImagePath({
                  collection: "appIcons",
                  fileName: "chat",
                })}
                width={buttonSize}
                height={buttonSize}
                draggable={false}
              />
            </UiButton>
          </div>
        </AddonCircle>
        <GameSelector
          className={cls.playButton}
          userGameStatusMap={user?.gameStatusMap}
          size={buttonSize}
          menuId={user?.username || ""}
          onGameClicked={onGameClicked}
        />
      </HStack>
    </HStack>
  );
});
