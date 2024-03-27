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
  const username = cookies["jwt-cookie"]?.user?.username;

  const [chatModals, setChatModals] = useState<ChatModalStateProps[]>();

  const { data, isLoading, isError, error } = useQuery<User[], Error>(
    "users",
    () => apiService.getUsers(token),
    {
      enabled: !!token,
      onSuccess: (fetchedUsers) => {
        setUsersOnline(onlineUsernames, fetchedUsers);
      },
    }
  );
  const { onlineUsernames, setUsersOnline, upToDateUsers } = useOnlineSocket({
    username,
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
          <div key={user._id}>
            <ChatModal
              currentUser={cookies["jwt-cookie"].user}
              receiverUser={user}
            />
          </div>
        );
      })}
    </div>
  );
};
