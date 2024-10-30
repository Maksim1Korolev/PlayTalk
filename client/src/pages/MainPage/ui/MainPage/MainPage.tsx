import { useSockets } from "@/shared/lib";
import { StarsBackground } from "@/shared/ui";

import { GameRequest } from "@/features/game";
import { ChatModals, useChatModals } from "@/widgets/ChatModals";
import { GameModals } from "@/widgets/GameModals";
import { Sidebar } from "@/widgets/Sidebar";

import { useGameSessionLogic } from "../../hooks/useGameSessionLogic";
import { useMainSocketSubs } from "../../hooks/useMainSocketSubs";

const MainPage = ({ className }: { className?: string }) => {
  const { chatModals, handleCloseChatModal, handleOpenChatModal } =
    useChatModals();

  const { gameModals, handleCloseGameModal, handleGameClicked } =
    useGameSessionLogic();

  useSockets();

  useMainSocketSubs();

  return (
    <>
      <StarsBackground />
      <div className={className}>
        <Sidebar
          handleUserChatButton={handleOpenChatModal}
          handleUserPlayButton={handleGameClicked}
        />
        <GameRequest />
        <ChatModals chatModals={chatModals} onClose={handleCloseChatModal} />
        <GameModals gameModals={gameModals} onClose={handleCloseGameModal} />
      </div>
    </>
  );
};

export default MainPage;
