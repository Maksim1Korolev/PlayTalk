import { User, UserListCard } from "@/entities/User";

import { cx } from "@/shared/lib/cx";
import { Card, VStack } from "@/shared/ui";
import { memo, useMemo } from "react";
import { sortUsers } from "../model/userListUtils";
import cls from "./UserList.module.scss";

export interface UserListProps {
  className?: string;
  users?: User[]; // Change 'users?: User[]' to 'users: User[]'
  busy?: boolean;
  collapsed?: boolean;
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
    collapsed,
    handleUserChatButton,
    handleUserInviteButton,
  }: UserListProps) => {
    console.log("USERSSSS:::: (from userlist)");
    console.log(users);

    const userList = useMemo(() => {
      const sortedUsers = users ? [...users].sort(sortUsers) : [];
      return sortedUsers?.map((user, index) => (
        <div key={user._id}>
          <UserListCard
            className={cls.userCard}
            user={user}
            busy={busy}
            collapsed={collapsed}
            handleInviteButton={handleUserInviteButton}
            handleChatButton={handleUserChatButton}
          />
          {index < sortedUsers.length - 1 && <hr />}
        </div>
      ));
    }, [busy, collapsed, handleUserChatButton, handleUserInviteButton, users]);
		
    if (!users || users.length === 0) {
      return <p>No users available.</p>;
    }


    return (
      <Card className={cx(cls.UserList, {}, [className])}>
        <VStack gap="16">{userList}</VStack>
      </Card>
    );
  }
);
