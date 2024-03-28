import { useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { User } from "../../../entities/User";
import { UserList } from "../../../features/UserList";
import { Loader } from "../../../shared/ui";
import { apiService } from "../api/apiUsersService";
import cls from "./OnlinePage.module.scss";
import { useOnlineSocket } from "../hooks/useOnlineSocket";
import { ChatModal } from "../../../widgets/ChatModal";

interface ChatModalStateProps {
  user: User;
}

export const OnlinePage = ({ className }: { className?: string }) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const token = cookies["jwt-cookie"]?.token;
  const currentUser = cookies["jwt-cookie"]?.user;

  const [chatModals, setChatModals] = useState<ChatModalStateProps[]>();

  const { data, isLoading, isError, error } = useQuery<User[], Error>(
    "users",
    () => apiService.getUsers(token),
    {
      enabled: !!token,
      onSuccess: (fetchedUsers) => {
        const otherUsers = fetchedUsers.filter(
          (user) => user._id !== currentUser._id
        );
        setUsersOnline(onlineUsernames, otherUsers);
      },
    }
  );
  const { onlineUsernames, setUsersOnline, upToDateUsers } = useOnlineSocket({
    username: currentUser.username,
    data,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }
  const handleOpenNewChat = (user: User) => {
    const newChatModalProps: ChatModalStateProps = { user };

    setChatModals((prev) => [...(prev || []), newChatModalProps]);
  };

  return (
    <div className={`${cls.OnlinePage} ${className || ""}`}>
      <h2>Online Users</h2>
      <UserList
        handleUserChatButton={handleOpenNewChat}
        users={upToDateUsers}
      />
      {chatModals?.map(({ user }) => {
        return (
          <ChatModal
            key={user._id}
            currentUser={currentUser}
            receiverUser={user}
          />
        );
      })}
    </div>
  );
};
