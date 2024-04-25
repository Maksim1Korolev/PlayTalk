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
  handleInviteButton: (invitedUsername: string) => void;
  handleChatButton: (user: User) => void;
}) => {
  const onChatButton = () => {
    handleChatButton(user);
  };

  const handlePlayButton = () => {
    handleInviteButton(user.username);
  };
  return (
    <Card className={`${cls.UserCard} ${className}`}>
      <HStack>
        <UiText>{user.username}</UiText>
        <UiButton onClick={onChatButton}>Chat</UiButton>
        <UiButton onClick={handlePlayButton}>Play</UiButton>
        <UserOnlineIndicator isOnline={user.isOnline} />
      </HStack>
    </Card>
  );
};
