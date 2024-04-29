import { User } from "@/entities/User";
import cls from "./UserCard.module.scss";
import { Card, HStack, UiButton, UiText } from "@/shared/ui";
import { UserOnlineIndicator } from "../../UserOnlineIndicator";

export const UserCard = ({
  className,
  user,
  handleInviteButton,
  handleChatButton,
}: {
  className?: string;
  user: User;
  handleInviteButton: ({
    receiverUsername,
    areBusy,
  }: {
    receiverUsername: string;
    areBusy?: boolean;
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
        <UiButton onClick={onPlayButton}>Play</UiButton>
        <UserOnlineIndicator isOnline={user.isOnline} />
      </HStack>
        <div> Is in game: {user.inGame ? "da" : "net"}</div>
    </Card>
  );
};
