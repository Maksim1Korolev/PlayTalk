import cls from "./OnlinePage.module.scss";

import { cx } from "@/shared/lib";
import { HStack, VStack } from "@/shared/ui";

import { GameModals, GameRequest, GameSelector } from "@/features/game";
import { Sidebar } from "@/widgets/Sidebar";

import { useOnlinePageSockets } from "../../hooks/useOnlinePageSockets";
import { ChatModals } from "../ChatModals";
import { useChatModals } from "../ChatModals/hooks/useChatModals";

const OnlinePage = ({ className }: { className?: string }) => {
  const { chatModals, handleCloseChatModal, handleOpenChatModal } =
    useChatModals();

  const {
    lastClickedPlayUser,
    gameModals,
    handleCloseGameModal,
    handleOpenGameSelector,
    handleGameClicked,
  } = useOnlinePageSockets();

  return (
    <div className={cx(cls.OnlinePage, {}, [className])}>
      <Sidebar
        handleUserChatButton={handleOpenChatModal}
        handleUserPlayButton={handleOpenGameSelector}
      />
      <HStack max>
        <VStack>
          <GameRequest />
          {lastClickedPlayUser && (
            <GameSelector
              user={lastClickedPlayUser}
              onGameSelect={handleGameClicked}
            />
          )}
        </VStack>
      </HStack>
      <ChatModals chatModals={chatModals} onClose={handleCloseChatModal} />
      <GameModals gameModals={gameModals} onClose={handleCloseGameModal} />
    </div>
  );
};

export default OnlinePage;
