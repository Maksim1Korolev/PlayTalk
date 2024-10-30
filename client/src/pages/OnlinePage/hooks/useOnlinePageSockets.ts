import { useSockets } from "@/shared/lib";

import { useGameSessionLogic } from "./useGameSessionLogic";
import { useOnlineSockets } from "./useOnlineSockets";

export const useOnlinePageSockets = () => {
  const { gameModals, handleGameClicked, handleCloseGameModal } =
    useGameSessionLogic();

  useSockets();

  useOnlineSockets();

  return {
    gameModals,
    handleCloseGameModal,
    handleGameClicked,
  };
};
