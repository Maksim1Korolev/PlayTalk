import { User } from "@/entities/User";
import { GameRequest } from "@/features/GameRequest";
import resources from "@/shared/assets/locales/en/OnlinePageResources.json";
import { cx } from "@/shared/lib/cx";
import { HStack, Loader, UiText, VStack } from "@/shared/ui";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { GameWidget } from "@/widgets/GameWidget";
import { Sidebar } from "@/widgets/Sidebar";
import { fetchUsersStatus } from "../../api/updateUsersStatusApiService";
import { ChatModalStateProps } from "../../hooks/useChatModals";
import { useOnlinePageSockets } from "../../hooks/useOnlinePageSockets";
import { ChatModals } from "../ChatModals";
import cls from "./OnlinePage.module.scss";

const OnlinePage = ({ className }: { className?: string }) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  console.log(cookies);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>();

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

  const handleOpenChatModal = useCallback(
    (user: User) => {
      if (chatModals && chatModals.length > 5) {
        alert(resources.chatModalQuantityError);
        return;
      }
      if (chatModals?.find(({ user: currentUser }) => currentUser === user))
        return;

      const position = findNewModalPosition(chatModals || []);

      const newChatModalProps: ChatModalStateProps = { user, position };

      setChatModals(prev => [...(prev || []), newChatModalProps]);
    },
    [chatModals]
  );

  const {
    upToDateUsers,
    isInvitedToGame,
    gameInviteSenderUsername,
    updateUsers,
    handleSendGameInvite,
    handleAcceptGame,
    handleEndGame,
  } = useOnlinePageSockets();

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsersStatus({
        setError,
        setIsError,
        setIsLoading,
        token,
        currentUser,
        updateUsers,
      });
    };

    if (token) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <HStack max>
        <VStack>
          <UiText size="xl">{resources.onlineUsersHeading}</UiText>
          <Sidebar
            busy={currentUser.inGame || currentUser.inInvite}
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
        <GameWidget handleConcede={handleEndGame} inGame={currentUser.inGame} />
      </HStack>
    </div>
  );
};

export default OnlinePage;
