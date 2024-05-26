import { User } from "@/entities/User";
import { Card, HStack, UiButton, UiText } from "@/shared/ui";
import { UserOnlineIndicator } from "../../UserOnlineIndicator";
import cls from "./UserCard.module.scss";

export const UserCard = ({
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
    <Card className={`${cls.UserCard} ${className}`}>
      <HStack>
        <UiText>{user.username}</UiText>
        <UiButton onClick={onChatButton}>Chat</UiButton>
        <UiButton
          onClick={onPlayButton}
          disabled={user.inGame || user.inInvite || busy || !user.isOnline}
        >
          Play
        </UiButton>
        <UserOnlineIndicator isOnline={user.isOnline} />
      </HStack>
      <div> Is invited: {user.inInvite ? "da" : "net"}</div>
      <div> Is in game: {user.inGame ? "da" : "net"}</div>
    </Card>
  );
};
