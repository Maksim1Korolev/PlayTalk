import { User } from "@/entities/User";
import { AvatarWithProps } from "@/features/AvatarWithProps";
import { UnreadMessagesCountIndicator } from "@/features/UnreadMessagesCountIndicator";
import { cx } from "@/shared/lib/cx";
import { HStack, UiButton } from "@/shared/ui";
import { UserOnlineIndicator } from "../../UserOnlineIndicator";
import cls from "./UserListCard.module.scss";

export const UserListCard = ({
  className,
  user,
  busy,
  collapsed,
  handleInviteButton,
  handleChatButton,
}: {
  className?: string;
  user: User;
  busy?: boolean;
  collapsed?: boolean;
  handleInviteButton: ({
    receiverUsername,
  }: {
    receiverUsername: string;
  }) => void;
  handleChatButton: (user: User) => void;
}) => {
  const onChatOpen = () => {
    handleChatButton(user);
  };

  const onPlayButton = () => {
    handleInviteButton({ receiverUsername: user.username });
  };

  //if (collapsed)
  //  return (
  //    <HStack
  //      className={cx(cls.UserListCard, { [cls.collapsed]: collapsed }, [
  //        className,
  //      ])}
  //      gap="8"
  //    >
  //      <AvatarWithProps
  //        onClick={onChatOpen}
  //        size={50}
  //        avatarSrc={user.avatarFileName}
  //        addonTopRight={<UserOnlineIndicator isOnline={user.isOnline} />}
  //        addonBottomRight={
  //          <UnreadMessagesCountIndicator
  //            unreadMessagesCount={user.unreadMessageCount}
  //          />
  //        }
  //      />
  //    </HStack>
  //  );

  return (
    //<Card variant="light" className={`${cls.UserListCard} ${className}`}>
    <HStack
      className={cx(cls.UserListCard, { [cls.collapsed]: collapsed }, [
        className,
      ])}
      gap="8"
    >
      <AvatarWithProps
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
      <span>{user.username}</span>
      <UiButton
        onClick={onPlayButton}
        variant={collapsed ? "clear" : undefined}
        disabled={
          user.inGame || user.inInvite || busy || !user.isOnline || collapsed
        }
      >
        Play
      </UiButton>
      {/*<div> Is invited: {user.inInvite ? "da" : "net"}</div>
      <div> Is in game: {user.inGame ? "da" : "net"}</div>*/}
    </HStack>
    //</Card>
  );
};
