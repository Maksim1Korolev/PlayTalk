import { cx } from "@/shared/lib/cx";
import { useEffect, useState } from "react";
import cls from "./OnlinePage.module.scss";

import resources from "@/shared/assets/locales/en/OnlinePageResources.json";
import userListResources from "@/shared/assets/locales/en/UserListResources.json";

import { GameModals, GameRequest, GameSelector } from "@/features/game";
import { HStack, Loader, UiText, VStack } from "@/shared/ui";
import { Sidebar } from "@/widgets/Sidebar";
import { useCookies } from "react-cookie";
import { fetchUsersStatus } from "../../api/updateUsersStatusApiService";
import { useOnlinePageSockets } from "../../hooks/useOnlinePageSockets";
import { ChatModals } from "../ChatModals";
import { useChatModals } from "../ChatModals/hooks/useChatModals";

const OnlinePage = ({ className }: { className?: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>();
  const [cookies] = useCookies();
  const { user: currentUserFromCookies, token } = cookies["jwt-cookie"];

  const { chatModals, handleCloseChatModal, handleOpenChatModal } =
    useChatModals();

  const {
    currentUser,
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
        currentUser: currentUserFromCookies,
        token,
        setError,
        setIsError,
        setIsLoading,
        updateUsers,
      });
    };

    fetchData();
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
      <Sidebar
        users={upToDateUsers}
        handleUserChatButton={handleOpenChatModal}
        handleUserPlayButton={handleOpenGameSelector}
      />
      <HStack max>
        <VStack>
          <UiText size="xl">{userListResources.userListHeader}</UiText>

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
          
        </VStack>
      </HStack>
      <ChatModals
        currentUser={currentUser}
        chatModals={chatModals}
        onClose={handleCloseChatModal}
      />
      <GameModals gameModals={gameModals} onClose={onGameModalClose} />
    </div>
  );
};

export default OnlinePage;
