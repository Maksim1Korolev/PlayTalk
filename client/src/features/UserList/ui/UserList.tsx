import { User, UserListCard } from "@/entities/User";
import { Card, VStack } from "@/shared/ui";
import { memo } from "react";
import { sortUsers } from "../model/userListUtils";
import cls from "./UserList.module.scss";

interface UserListProps {
  className?: string;
  users?: User[];
  busy?: boolean;
  handleUserChatButton: (user: User) => void;
  handleUserInviteButton: ({
    receiverUsername,
  }: {
    receiverUsername: string;
  }) => void;
}

export const UserList = memo(
  ({
    className,
    users,
    busy,
    handleUserChatButton,
    handleUserInviteButton,
  }: UserListProps) => {
    console.log("USERSSSS:::: (from userlist)");
    console.log(users);
    if (!users || users.length === 0) {
      return <p>No users available.</p>;
    }

    const sortedUsers = [...users].sort(sortUsers);

    return (
      <Card>
        <VStack gap="16" className={`${cls.UserList} ${className || ""}`}>
          {sortedUsers?.map(user => (
            <UserListCard
              key={user._id}
              user={user}
              busy={busy}
              className={cls.userCard}
              handleInviteButton={handleUserInviteButton}
              handleChatButton={handleUserChatButton}
            />
          ))}
        </VStack>
      </Card>
    );
  }
);
