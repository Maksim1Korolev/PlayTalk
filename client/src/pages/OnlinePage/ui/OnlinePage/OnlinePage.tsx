import { cx } from "@/shared/lib/cx";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import cls from "./OnlinePage.module.scss";

import resources from "@/shared/assets/locales/en/OnlinePageResources.json";
import userListResources from "@/shared/assets/locales/en/UserListResources.json";

import { User } from "@/entities/User";
import { GameModals, GameRequest, GameSelector } from "@/features/game";
import { HStack, Loader, UiText, VStack } from "@/shared/ui";
import { Sidebar } from "@/widgets/Sidebar";
import { fetchUsersStatus } from "../../api/updateUsersStatusApiService";
import { useOnlinePageSockets } from "../../hooks/useOnlinePageSockets";
import { ChatModals } from "../ChatModals";
import { useChatModals } from "../ChatModals/hooks/useChatModals";

const OnlinePage = ({ className }: { className?: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>();

  const [cookies] = useCookies(["jwt-cookie"]);
  const token = cookies["jwt-cookie"]?.token;
  const currentUser: User = cookies["jwt-cookie"]?.user;

  const { chatModals, handleCloseChatModal, handleOpenChatModal } =
    useChatModals();

  const {
    users: upToDateUsers,
    invites,
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
      return (
        <UiText>{`${resources.errorMessagePrefix} ${error.message}`}</UiText>
      );
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

          {invites && (
            <GameRequest
              handleYesButton={handleGameRequestYesButton}
              handleNoButton={handleGameRequestNoButton}
              invites={invites}
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
        <ChatModals
          currentUser={currentUser}
          chatModals={chatModals}
          onClose={handleCloseChatModal}
        />
        <GameModals gameModals={gameModals} onClose={onGameModalClose} />
      </HStack>
    </div>
  );
};

export default OnlinePage;
