import { memo } from "react";
import { User, UserCard } from "@/entities/User";
import cls from "./UserList.module.scss";

interface UserListProps {
  className?: string;
  users?: User[];
  handleUserChatButton: (user: User) => void;
  handleUserInviteButton: (invitedUsername: string) => void;
}

export const UserList = memo(
  ({ className, users,handleUserChatButton ,handleUserInviteButton }: UserListProps) => {
    
    if (!users || users.length === 0) {
      return <p>No users available.</p>;
    }

    return (
      <ul className={`${cls.UserList} ${className || ""}`}>
        {users?.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            className={cls.userCard}
            handleInviteButton={handleUserInviteButton}
            handleChatButton={handleUserChatButton}
          />
        ))}
      </ul>
    );
  }
);
