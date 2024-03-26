import { memo } from "react";
import cls from "./UserList.module.scss";
import { User, UserCard } from "../../../entities/User";

interface UserListProps {
  className?: string;
  users?: User[];
  handleUserChatButton?: (user: User) => void;
}

export const UserList = memo(({ className, users, handleUserChatButton }: UserListProps) => {
  if (!users || users.length === 0) {
    return <p>No users available.</p>;
  }

  const handleChatButton = () => 

  return (
    <ul className={`${cls.UserList} ${className || ""}`}>
      {users?.map((user) => (
        <UserCard key={user._id} user={user} className={cls.userCard} handleChatButton={} handlePlayButton={}/>
      ))}
    </ul>
  );
});
