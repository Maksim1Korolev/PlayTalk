import { User } from "@/entities/User";
import { AvatarWithProps } from "@/features/AvatarWithProps";
import { UnreadMessagesCountIndicator } from "@/features/UnreadMessagesCountIndicator";
import { PlayButton } from "@/features/UserList/ui/PlayButton";
import { cx } from "@/shared/lib/cx";
import { HStack } from "@/shared/ui";
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
        avatarSrc={user.avatarFileName}
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
        <PlayButton className={cls.playButton} onClick={onPlayButton}>
          Play
        </PlayButton>
        {user.activeGames.length > 0 && "Active"}
      </HStack>
    </HStack>
  );
};
