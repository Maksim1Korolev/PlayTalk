import { User } from "@/entities/User";
import { AvatarWithProps } from "@/features/AvatarWithProps";
import { UnreadMessagesCountIndicator } from "@/features/UnreadMessagesCountIndicator";
import { HighlightType, PlayButton } from "@/features/UserList/ui/PlayButton";
import { cx } from "@/shared/lib/cx";
import { HStack } from "@/shared/ui";
import { useEffect, useState } from "react";
import { UserOnlineIndicator } from "../../UserOnlineIndicator";
import cls from "./UserListCard.module.scss";

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
    if (user.activeGames.length > 0) {
      setHighlight("primary");
    } else if (user.isInviting) {
      setHighlight("secondary");
    } else {
      setHighlight("none");
    }
  }, [user.activeGames.length, user.isInviting]);

  const onChatOpen = () => {
    handleChatButton(user);
  };

  const onPlayButton = () => {
    handlePlayButton(user);
  };

  return (
    <HStack
      className={cx(cls.UserListCard, { [cls.collapsed]: collapsed }, [
        className,
      ])}
      gap="8"
      max
    >
      <AvatarWithProps
        clickable
        onClick={onChatOpen}
        size={50}
        avatarSrc={`https://testforavatars.s3.eu-north-1.amazonaws.com/avatars/${user.avatarFileName}`}
        addonTopRight={<UserOnlineIndicator isOnline={user.isOnline} />}
        addonBottomRight={
          <UnreadMessagesCountIndicator
            unreadMessagesCount={user.unreadMessageCount}
          />
        }
      />
      <HStack className={cls.userInfo} max>
        <span className={cls.username} ref={userRef}>
          {user.username}
        </span>
        <PlayButton
          className={cls.playButton}
          highlight={highlight}
          onClick={onPlayButton}
        >
          Play
        </PlayButton>
      </HStack>
    </HStack>
  );
};
