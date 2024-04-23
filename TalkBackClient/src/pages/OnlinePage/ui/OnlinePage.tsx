import { User } from "@/entities/User";
import { UserList } from "@/features/UserList";
import resources from "@/shared/assets/locales/en/OnlinePageResources.json";
import { Loader, UiButton, UiText } from "@/shared/ui";
import { ChatModal } from "@/widgets/ChatModal";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { apiService } from "../api/apiUsersService";
import { ChatModalStateProps, useOnlineSocket } from "../hooks/useOnlineSocket";
import cls from "./OnlinePage.module.scss";
import { useInviteGameSocket, useReceiveInvite } from "../hooks/useGameSocket";
import { useCallback, useEffect, useState } from "react";
import { GameRequest } from "@/features/GameRequest";

const OnlinePage = ({ className }: { className?: string }) => {
  const [cookies, , removeCookie] = useCookies(["jwt-cookie"]);
  const token = cookies["jwt-cookie"]?.token;
  const currentUser = cookies["jwt-cookie"]?.user;
  const [isInvitedToGame, setIsInvitedToGame] = useState(false);
  const navigate = useNavigate();
  const [gameInviteSenderUsername, setGameInviteSenderUsername] = useState("");
  const [usersWithUpdatedStatus, setUsersWithUpdatedStatus] =
    useState<User[]>();
  const { data, isLoading, isError, error } = useQuery<User[], Error>(
    "users",
    () => apiService.getUsers(token),
    {
      enabled: !!token,
      onSuccess: (fetchedUsers) => {
        const otherUsers = fetchedUsers.filter(
          (user) => user._id !== currentUser._id
        );

        updateUsersStatus(otherUsers);
      },
    }
  );

  const updateUsersStatus = (users: User[]) => {
    const usersWithOnlineStatus = setUsersOnline(onlineUsernames, users);
    setUsersGameStatus(inGameUsernames, usersWithOnlineStatus);
    setUsersWithUpdatedStatus(usersWithGameStatus);
  };

  //remove usersWithOnlineStatus?
  const {
    onlineUsernames,
    usersWithOnlineStatus,
    chatModals,
    setChatModals,
    setUsersOnline,
    handleUserMessage,
  } = useOnlineSocket({
    data,
  });

  const {
    inGameUsernames,
    usersWithGameStatus,
    setUsersGameStatus,
    handleUserInvite,
  } = useInviteGameSocket({
    data: usersWithOnlineStatus,
  });

  const receiveInviteSubscribe = useCallback(
    ({ senderUsername }: { senderUsername: string }) => {
      console.log(senderUsername);
      setGameInviteSenderUsername(senderUsername);
      setIsInvitedToGame(true);
    },
    []
  );
  useEffect(() => {
    const disconnect = useReceiveInvite(receiveInviteSubscribe);
    return () => {
      disconnect();
    };
  }, []);

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
    if (chatModals && chatModals.length >= 5) {
      alert(resources.chatModalQuantityError);
      return;
    }

    const newChatModalProps: ChatModalStateProps = { user };

    setChatModals((prev) => [...(prev || []), newChatModalProps]);
  };

  const handleCloseChat = (userId: string) => {
    setChatModals((prev) => prev?.filter((modal) => modal.user._id !== userId));
  };

  return (
    <div className={`${cls.OnlinePage} ${className || ""}`}>
      <UiButton onClick={handleLogout}>{resources.logoutButton}</UiButton>
      <UiText size="xl">{resources.onlineUsersHeading}</UiText>
      <UserList
        handleUserChatButton={handleOpenNewChat}
        users={usersWithUpdatedStatus}
        handleUserInviteButton={handleUserInvite}
      />
      {chatModals?.map(({ user }) => {
        return (
          <ChatModal
            key={user._id}
            currentUsername={currentUser.username}
            receiverUser={user}
            handleSendMessage={handleUserMessage}
            handleCloseModal={handleCloseChat}
          />
        );
      })}
      {isInvitedToGame && (
        <GameRequest senderUsername={gameInviteSenderUsername}></GameRequest>
      )}
    </div>
  );
};

export default OnlinePage;
