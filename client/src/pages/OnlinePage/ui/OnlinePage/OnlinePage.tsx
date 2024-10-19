import { cx } from "@/shared/lib/cx";
import cls from "./OnlinePage.module.scss";

import { GameModals, GameRequest, GameSelector } from "@/features/game";
import { HStack, VStack } from "@/shared/ui";
import { Sidebar } from "@/widgets/Sidebar";
import { useOnlinePageSockets } from "../../hooks/useOnlinePageSockets";
import { ChatModals } from "../ChatModals";
import { useChatModals } from "../ChatModals/hooks/useChatModals";
import { useAppSelector } from "@/shared/lib/hooks/storeHooks";
import { getUsers } from "@/entities/User/model/selectors/getUsers";

const OnlinePage = ({ className }: { className?: string }) => {
  const users = useAppSelector(getUsers);

  const { chatModals, handleCloseChatModal, handleOpenChatModal } =
    useChatModals();

  const {
    currentUser,
    invites,
    lastClickedPlayUser,
    gameModals,
    handleCloseGameModal,
    handleOpenGameSelector,
    handleGameClicked,
    handleGameRequestYesButton,
    handleGameRequestNoButton,
  } = useOnlinePageSockets(users);

  return (
    <div className={cx(cls.OnlinePage, {}, [className])}>
      <Sidebar
        handleUserChatButton={handleOpenChatModal}
        handleUserPlayButton={handleOpenGameSelector}
      />
      <HStack max>
        <VStack>
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
      </HStack>
      <ChatModals
        currentUser={currentUser}
        chatModals={chatModals}
        onClose={handleCloseChatModal}
      />
      <GameModals gameModals={gameModals} onClose={handleCloseGameModal} />
    </div>
  );
};

export default OnlinePage;
