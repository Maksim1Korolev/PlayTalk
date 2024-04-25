import { User } from "@/entities/User";
import { GameRequest } from "@/features/GameRequest";
import { UserList } from "@/features/UserList";
import resources from "@/shared/assets/locales/en/OnlinePageResources.json";
import { Loader, UiButton, UiText } from "@/shared/ui";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../api/apiUsersService";
import { useOnlinePageSockets } from "../../hooks/useOnlinePageSockets";
import cls from "./OnlinePage.module.scss";
import { cx } from "@/shared/lib/cx";
import { ChatModals } from "../ChatModals";
import {  useState } from "react";
import { ChatModalStateProps } from "../../hooks/useInviteGameSocket";

const OnlinePage = ({ className }: { className?: string }) => {
  const [cookies, , removeCookie] = useCookies(["jwt-cookie"]);
  const token = cookies["jwt-cookie"]?.token;
  const currentUser = cookies["jwt-cookie"]?.user;

  const [chatModals, setChatModals] = useState<ChatModalStateProps[]>();

  const handleOpenChatModal = (user: User) => {
    if (chatModals && chatModals.length > 5) {
      alert(resources.chatModalQuantityError);
      return;
    }
    if (chatModals?.find(({ user: currentUser }) => currentUser === user))
      return;

    const newChatModalProps: ChatModalStateProps = { user };

    setChatModals((prev) => [...(prev || []), newChatModalProps]);
  };

  const navigate = useNavigate();

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

  const {
    usersWithUpdatedStatus,
    isInvitedToGame,
    gameInviteSenderUsername,
    updateUsersStatus,
    handleUserInvite,
  } = useOnlinePageSockets({
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
  return (
    <div className={cx(cls.OnlinePage, {}, [className])}>
      <UiButton onClick={handleLogout}>{resources.logoutButton}</UiButton>
      <UiText size="xl">{resources.onlineUsersHeading}</UiText>
      <UserList
        users={usersWithUpdatedStatus}
        handleUserChatButton={handleOpenChatModal}
        handleUserInviteButton={handleUserInvite}
      />
      <ChatModals currentUser={currentUser} chatModals={chatModals} setChatModals={setChatModals}/>
      {isInvitedToGame && (
        <GameRequest senderUsername={gameInviteSenderUsername} />
      )}
    </div>
  );
};

export default OnlinePage;
