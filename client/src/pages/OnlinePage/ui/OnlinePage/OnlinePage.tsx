import { cx } from "@/shared/lib/cx";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import cls from "./OnlinePage.module.scss";

import resources from "@/shared/assets/locales/en/OnlinePageResources.json";
import userListResources from "@/shared/assets/locales/en/UserListResources.json";

import { User } from "@/entities/User";
import { GameModals, GameRequest, GameSelector } from "@/features/game";
import { HStack, Loader, UiText, VStack } from "@/shared/ui";
import { Sidebar } from "@/widgets/Sidebar";
import { fetchUsersStatus } from "../../api/updateUsersStatusApiService";
import { ChatModalState } from "../../hooks/useChatModals";
import { useOnlinePageSockets } from "../../hooks/useOnlinePageSockets";
import { ChatModals } from "../ChatModals";

const OnlinePage = ({ className }: { className?: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>();

  const [cookies] = useCookies(["jwt-cookie"]);
  const token = cookies["jwt-cookie"]?.token;
  const currentUser: User = cookies["jwt-cookie"]?.user;

  const [chatModals, setChatModals] = useState<ChatModalState[]>();

  const findNewModalPosition = (modals: ChatModalState[]) => {
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
      if (
        chatModals?.find(
          ({ user: currentUser }) => currentUser.username === user.username
        )
      ) {
        return;
      }
      const position = findNewModalPosition(chatModals || []);

      const newChatModalProps: ChatModalState = { user, position };

      setChatModals(prev => [...(prev || []), newChatModalProps]);
    },
    [chatModals]
  );

  const {
    users: upToDateUsers,
    inviteData,
    lastClickedPlayUser,
    gameModals,
    onGameModalClose,
    updateUsers,
    handleOpenGameSelector,
    handleGameClicked,
    handleGameRequestYesButton,
    handleGameRequestNoButton,
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
          <UiText size="xl">{userListResources.userListHeader}</UiText>
          <Sidebar
            users={upToDateUsers}
            handleUserChatButton={handleOpenChatModal}
            handleUserPlayButton={handleOpenGameSelector}
          />

          <ChatModals
            currentUser={currentUser}
            chatModals={chatModals}
            setChatModals={setChatModals}
          />
          {inviteData && (
            <GameRequest
              handleYesButton={handleGameRequestYesButton}
              handleNoButton={handleGameRequestNoButton}
              inviteData={inviteData}
            />
          )}
          {
            //TODO:Maybe move GameSelector to UserCard
          }
          {lastClickedPlayUser && (
            <GameSelector
              user={lastClickedPlayUser}
              onGameSelect={handleGameClicked}
            />
          )}
        </VStack>
        <GameModals gameModals={gameModals} onClose={onGameModalClose} />
      </HStack>
    </div>
  );
};

export default OnlinePage;
