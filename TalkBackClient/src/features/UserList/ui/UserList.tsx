import { User, UserCard } from "@/entities/User";
import { memo } from "react";
import { sortUsers } from "../model/userListUtils";
import cls from "./UserList.module.scss";

interface UserListProps {
  className?: string;
  users?: User[];
  inGame?: boolean;
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
    inGame,
    handleUserChatButton,
    handleUserInviteButton,
  }: UserListProps) => {
    console.log("USERSSSS::::");
    console.log(users);
    if (!users || users.length === 0) {
      return <p>No users available.</p>;
    }

    const sortedUsers = [...users].sort(sortUsers);

    return (
      <ul className={`${cls.UserList} ${className || ""}`}>
        {sortedUsers?.map(user => (
          <UserCard
            key={user._id}
            user={user}
            inGame={inGame}
            className={cls.userCard}
            handleInviteButton={handleUserInviteButton}
            handleChatButton={handleUserChatButton}
          />
        ))}
      </ul>
    );
  }
);
