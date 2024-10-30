import cls from "./OnlinePage.module.scss";

import { cx } from "@/shared/lib";
import { StarsBackground } from "@/shared/ui/Background";

import { GameModals, GameRequest } from "@/features/game";
import { Sidebar } from "@/widgets/Sidebar";

import { useOnlinePageSockets } from "../../hooks/useOnlinePageSockets";
import { ChatModals } from "../ChatModals";
import { useChatModals } from "../ChatModals/hooks/useChatModals";

const OnlinePage = ({ className }: { className?: string }) => {
  const { chatModals, handleCloseChatModal, handleOpenChatModal } =
    useChatModals();

  const { gameModals, handleCloseGameModal, handleGameClicked } =
    useOnlinePageSockets();

  return (
    <>
      <StarsBackground />
      <div className={cx(cls.OnlinePage, {}, [className])}>
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

export default OnlinePage;
