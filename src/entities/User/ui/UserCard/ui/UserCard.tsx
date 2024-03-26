import { memo } from "react";
import cls from "./UserCard.module.scss";
import { User } from "../../../model/user";
import { Card, HStack, UiButton, UiText } from "../../../../../shared/ui";
import { UserOnlineIndicator } from "../../UserOnlineIndicator";

export const UserCard = ({
  className,
  user,
  handleChatButton,
  handlePlayButton,
}: {
  className?: string;
  user: User;
  handleChatButton: () => void;
  handlePlayButton: () => void;
}) => {
  return (
    <Card className={`${cls.UserCard} ${className}`}>
      <HStack>
        <UiText>{user.username}</UiText>
        <UiButton onClick={handleChatButton}>Chat</UiButton>
        <UiButton onClick={handlePlayButton}>Play</UiButton>
        <UserOnlineIndicator isOnline={user.isOnline} />
      </HStack>
    </Card>
  );
};
