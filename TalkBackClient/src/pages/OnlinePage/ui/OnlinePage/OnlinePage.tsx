import { User } from "@/entities/User";
import { GameRequest } from "@/features/GameRequest";
import { UserList } from "@/features/UserList";
import resources from "@/shared/assets/locales/en/OnlinePageResources.json";
import { cx } from "@/shared/lib/cx";
import { HStack, UiButton, UiText, VStack } from "@/shared/ui";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useUsersStatus } from "../../api/updateUsersStatusApiService";

import { ChatModalStateProps } from "../../hooks/useChatModals";
import { useOnlinePageSockets } from "../../hooks/useOnlinePageSockets";
import { ChatModals } from "../ChatModals";
import cls from "./OnlinePage.module.scss";
import { GameWidget } from "@/widgets/GameWidget";

const OnlinePage = ({ className }: { className?: string }) => {
  const [cookies, , removeCookie] = useCookies(["jwt-cookie"]);
  const token = cookies["jwt-cookie"]?.token;
  const currentUser: User = cookies["jwt-cookie"]?.user;

  const [chatModals, setChatModals] = useState<ChatModalStateProps[]>();
  const findNewModalPosition = (modals: ChatModalStateProps[]) => {
    let x = window.innerWidth - 400;
    let y = window.innerHeight - 300;
    const offset = 30;

    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      if (x === modal.position?.x && y === modal.position.y) {
        x -= offset;
        y -= offset;

        if (x < 0 || y < 0) {
          x = window.innerWidth - 400;
          y = window.innerHeight - 300;
        }
      }
    }
    console.log(x, y);

    return { x, y };
  };

  const handleOpenChatModal = (user: User) => {
    if (chatModals && chatModals.length > 5) {
      alert(resources.chatModalQuantityError);
      return;
    }
    if (chatModals?.find(({ user: currentUser }) => currentUser === user))
      return;

    const position = findNewModalPosition(chatModals || []);

    const newChatModalProps: ChatModalStateProps = { user, position };

    setChatModals(prev => [...(prev || []), newChatModalProps]);
  };

  const navigate = useNavigate();

  const {
    upToDateUsers,
    isInvitedToGame,
    gameInviteSenderUsername,
    updateUsers,
    handleSendGameInvite,
    handleAcceptGame,
    handleEndGame,
  } = useOnlinePageSockets();

  useUsersStatus(token, updateUsers, currentUser);

  const handleLogout = () => {
    removeCookie("jwt-cookie");
    navigate("/auth");
  };

  //if (isLoading) {
  //	return <Loader />
  //}

  //if (isError && error) {
  //	{
  //		isError && error ? (
  //			<UiText>{`${resources.errorMessagePrefix} ${error.message}`}</UiText>
  //		) : null
  //	}
  //}
  return (
    <div className={cx(cls.OnlinePage, {}, [className])}>
      <HStack max>
        <VStack>
          <UiButton onClick={handleLogout}>{resources.logoutButton}</UiButton>
          <UiText size="xl">{resources.onlineUsersHeading}</UiText>
          <UserList
            inGame={currentUser.inGame}
            users={upToDateUsers}
            handleUserChatButton={handleOpenChatModal}
            handleUserInviteButton={handleSendGameInvite}
          />
          <ChatModals
            currentUser={currentUser}
            chatModals={chatModals}
            setChatModals={setChatModals}
          />
          {isInvitedToGame && (
            <GameRequest
              handleYesButton={handleAcceptGame}
              handleNoButton={handleEndGame}
              senderUsername={gameInviteSenderUsername}
            />
          )}
        </VStack>
        <GameWidget />
      </HStack>
    </div>
  );
};

export default OnlinePage;
