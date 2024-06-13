import { User } from "@/entities/User";
import { AvatarWithProps } from "@/features/AvatarWithProps";
import { UnreadMessagesCountIndicator } from "@/features/UnreadMessagesCountIndicator";
import { cx } from "@/shared/lib/cx";
import { HStack, UiButton, UiText } from "@/shared/ui";
import { UserOnlineIndicator } from "../../UserOnlineIndicator";
import cls from "./UserListCard.module.scss";

export const UserListCard = ({
  className,
  user,
  busy,
  handleInviteButton,
  handleChatButton,
}: {
  className?: string;
  user: User;
  busy?: boolean;
  handleInviteButton: ({
    receiverUsername,
  }: {
    receiverUsername: string;
  }) => void;
  handleChatButton: (user: User) => void;
}) => {
  const onChatButton = () => {
    handleChatButton(user);
  };

  const onPlayButton = () => {
    handleInviteButton({ receiverUsername: user.username });
  };
  return (
    //<Card variant="light" className={`${cls.UserListCard} ${className}`}>
    <HStack className={cx(cls.UserListCard, {}, [className])} gap="8">
      <AvatarWithProps
        size={50}
        avatarSrc={user.avatarFileName}
        unreadMessageCount={user.unreadMessageCount}
        isOnline={user.isOnline}
        addonTopRight={<UserOnlineIndicator isOnline={user.isOnline} />}
        addonBottomRight={
          <UnreadMessagesCountIndicator
            unreadMessagesCount={user.unreadMessageCount}
          />
        }
      />
      <UiText>{user.username}</UiText>
      <UiButton onClick={onChatButton}>Chat</UiButton>
      <UiButton
        onClick={onPlayButton}
        disabled={user.inGame || user.inInvite || busy || !user.isOnline}
      >
        Play
      </UiButton>
      {/*<div> Is invited: {user.inInvite ? "da" : "net"}</div>
      <div> Is in game: {user.inGame ? "da" : "net"}</div>*/}
    </HStack>
    //</Card>
  );
};
