import { User } from "@/entities/User";
import { AvatarWithProps } from "@/features/AvatarWithProps";
import { UnreadMessagesCountIndicator } from "@/features/UnreadMessagesCountIndicator";
import { PlayButton } from "@/features/UserList/ui/PlayButton";
import { cx } from "@/shared/lib/cx";
import { HStack } from "@/shared/ui";
import { UserOnlineIndicator } from "../../UserOnlineIndicator";
import cls from "./UserListCard.module.scss";

export const UserListCard = ({
  className,
  user,
  busy,
  collapsed,
  handlePlayButton,
  handleChatButton,
  userRef,
}: {
  className?: string;
  user: User;
  busy?: boolean;
  collapsed?: boolean;
  handlePlayButton: ({
    opponentUsername,
  }: {
    opponentUsername: string;
  }) => void;
  handleChatButton: (user: User) => void;
  userRef: (el: HTMLSpanElement | null) => void;
}) => {
  const onChatOpen = () => {
    handleChatButton(user);
  };

  const onPlayButton = () => {
    handlePlayButton({ opponentUsername: user.username });
  };

  return (
    //<Card variant="light" className={`${cls.UserListCard} ${className}`}>
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
        <PlayButton
          className={cls.playButton}
          onClick={onPlayButton}
          disabled={!user.isOnline}
        >
          Play
        </PlayButton>
      </HStack>
      {/*<div> Is invited: {user.inInvite ? "da" : "net"}</div>
      <div> Is in game: {user.inGame ? "da" : "net"}</div>*/}
    </HStack>
    //</Card>
  );
};
