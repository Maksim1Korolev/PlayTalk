import cls from "./UserListCard.module.scss";

import { cx } from "@/shared/lib";
import { AddonCircle, AppImageProps, HStack } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import { UnreadMessagesCountIndicator } from "@/entities/Chat";
import { GameData, GameName } from "@/entities/game/Game";
import { User } from "@/entities/User";
import { PlayButton } from "@/features/UserList/ui/PlayButton";

import { UserOnlineIndicator } from "../../UserOnlineIndicator";

interface UserListCardProps {
  className?: string;
  user: User;
  collapsed?: boolean;
  handlePlayButton: ({
    gameData,
    isInviting,
    isActive,
  }: {
    gameData: GameData;
    isInviting: boolean;
    isActive: boolean;
  }) => void;
  handleChatButton: (user: User) => void;
  userRef: (el: HTMLSpanElement | null) => void;
}

export const UserListCard = ({
  className = "",
  user,
  collapsed = false,
  handlePlayButton,
  handleChatButton,
  userRef,
}: UserListCardProps) => {
  const onChatOpen = () => {
    handleChatButton(user);
  };

  const onPlayButton = (gameName: GameName) => {
    handlePlayButton({
      gameData: {
        gameName,
        opponentUsername: user.username,
      },
      isInviting: user.isInviting || false,
      isActive: user.activeGames?.includes(gameName) || false,
    });
  };

  const setIconProps = () => {
    const size = 50;

    const avatarSrc = getImagePath({
      collection: "avatars",
      fileName: user.avatarFileName,
    });

    const iconProps: AppImageProps = {
      src: avatarSrc,
      width: size,
      height: size,
      alt: user.username,
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
        addonTopRight={<UserOnlineIndicator isOnline={user.isOnline} />}
        addonBottomRight={
          <UnreadMessagesCountIndicator
            unreadMessagesCount={user.unreadMessageCount}
          />
        }
        onClick={onChatOpen}
      />
      <HStack className={cls.userInfo} max>
        <span className={cls.username} ref={userRef}>
          {user.username}
        </span>

        <PlayButton
          highlight="none"
          className={cls.playButton}
          onSelectGame={onPlayButton}
          menuId={user.username}
        />
      </HStack>
    </HStack>
  );
};
