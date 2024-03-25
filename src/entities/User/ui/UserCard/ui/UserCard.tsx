import { memo } from "react";
import cls from "./UserCard.module.scss";
import { User } from "../../../model/user";
import { Card, HStack, UiButton, UiText } from "../../../../../shared/ui";
import { UserOnlineIndicator } from "../../UserOnlineIndicator";

export const UserCard = ({
  className,
  user,
}: {
  className?: string;
  user: User;
}) => {
  return (
    <Card className={`${cls.UserCard} ${className}`}>
      <HStack>
        <UiText>{user.username}</UiText>
        <UiButton>Chat</UiButton>
        <UiButton>Play</UiButton>
        <UserOnlineIndicator isOnline={user.isOnline} />
      </HStack>
    </Card>
  );
};
