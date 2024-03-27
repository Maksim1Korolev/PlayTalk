import { memo } from "react";
import { User, UserCard } from "../../../entities/User";
import cls from "./UserList.module.scss";
import { useCookies } from "react-cookie";

interface UserListProps {
  className?: string;
  users?: User[];
  handleUserChatButton: (user: User) => void;
}

export const UserList = memo(
  ({ className, users, handleUserChatButton }: UserListProps) => {
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
            handleUserChatButton={handleUserChatButton}
            handlePlayButton={() => {}}
          />
        ))}
      </ul>
    );
  }
);
