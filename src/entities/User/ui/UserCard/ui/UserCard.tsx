import { memo } from "react";
import cls from "./UserCard.module.scss";
import { User } from "../../../model/user";
import { Card, HStack, UiButton, UiText } from "../../../../../shared/ui";

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
      </HStack>
    </Card>
  );
};
