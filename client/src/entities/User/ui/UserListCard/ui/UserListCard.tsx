import { User } from "@/entities/User"
import { UnreadMessagesCountIndicator } from "@/features/UnreadMessagesCountIndicator"
import { HighlightType, PlayButton } from "@/features/UserList/ui/PlayButton"
import { cx } from "@/shared/lib"
import { AddonCircle, AppImageProps, HStack } from "@/shared/ui"
import getImagePath from "@/shared/utils/getImagePath"
import { useEffect, useState } from "react"
import { UserOnlineIndicator } from "../../UserOnlineIndicator"
import cls from "./UserListCard.module.scss"

interface UserListCardProps {
  className?: string;
  user: User;
  collapsed?: boolean;
  handlePlayButton: (user: User) => void;
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
  const [highlight, setHighlight] = useState<HighlightType>("none");

  useEffect(() => {
    if (user.activeGames && user.activeGames?.length > 0) {
      setHighlight("primary");
    } else if (user.isInviting) {
      setHighlight("secondary");
    } else {
      setHighlight("none");
    }
  }, [user.activeGames, user.isInviting]);

  const onChatOpen = () => {
    handleChatButton(user);
  };

  const onPlayButton = () => {
    handlePlayButton(user);
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
          className={cls.playButton}
          highlight={highlight}
          onSelectGame={onPlayButton}
        />
      </HStack>
    </HStack>
  );
};
