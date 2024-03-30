import { useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { User } from "@/entities/User";
import { UserList } from "@/features/UserList";
import { Loader, UiButton } from "@/shared/ui";
import { apiService } from "../api/apiUsersService";
import cls from "./OnlinePage.module.scss";
import { useNavigate } from "react-router-dom";
import { ChatModal } from "@/widgets/ChatModal";
import { useOnlineSocket } from "../hooks/useOnlineSocket";

interface ChatModalStateProps {
  user: User;
}

export const OnlinePage = ({ className }: { className?: string }) => {
  const [cookies, , removeCookie] = useCookies(["jwt-cookie"]);
  const token = cookies["jwt-cookie"]?.token;
  const currentUser = cookies["jwt-cookie"]?.user;
  const navigate = useNavigate();

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

  const handleLogout = () => {
    removeCookie("jwt-cookie");
    navigate("/auth");
  };

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
      <UiButton onClick={handleLogout}>Logout</UiButton>
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
