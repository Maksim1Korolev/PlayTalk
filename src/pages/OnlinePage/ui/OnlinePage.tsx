

import resources from "@/public/resources/OnlinePageResources.json";
import { User } from '@/entities/User'
import { UserList } from '@/features/UserList'
import { Loader, UiButton, UiText} from '@/shared/ui'
import { ChatModal } from '@/widgets/ChatModal'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../api/apiUsersService'
import { useOnlineSocket } from '../hooks/useOnlineSocket'
import cls from './OnlinePage.module.scss'

interface ChatModalStateProps {
  user: User;
}

const OnlinePage = ({ className }: { className?: string }) => {
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
  const {
    onlineUsernames,
    setUsersOnline,
    upToDateUsers,
    handleUserMessage,
    receiveMessageSubscribe,
  } = useOnlineSocket({
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
    {
      isError && error ? (
        <UiText>{`${resources.errorMessagePrefix} ${error.message}`}</UiText>
      ) : null;
    }
  }
  const handleOpenNewChat = (user: User) => {
    const newChatModalProps: ChatModalStateProps = { user };

    setChatModals((prev) => [...(prev || []), newChatModalProps]);
  };

  return (
    <div className={`${cls.OnlinePage} ${className || ""}`}>
      <UiButton onClick={handleLogout}>{resources.logoutButton}</UiButton>
      <UiText size="xl">{resources.onlineUsersHeading}</UiText>
      <UserList
        handleUserChatButton={handleOpenNewChat}
        users={upToDateUsers}
      />
      {chatModals?.map(({ user }) => {
        return (
          <ChatModal
            key={user._id}
            receiverUser={user}
            receiveMessageSubscribe={receiveMessageSubscribe}
            handleUserSend={handleUserMessage}
          />
        );
      })}
    </div>
  );
};

export default OnlinePage;
