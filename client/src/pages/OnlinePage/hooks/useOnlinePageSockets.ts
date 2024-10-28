import { useSockets } from "@/shared/lib";
import { useAppSelector } from "@/shared/lib";

import { getCurrentUser, getUsers } from "@/entities/User";

import { useGameSessionLogic } from "./useGameSessionLogic";
import { useOnlineSockets } from "./useOnlineSockets";

export const useOnlinePageSockets = () => {
  const currentUser = useAppSelector(getCurrentUser);

  const {
    lastClickedPlayUser,
    gameModals,
    handleGameClicked,
    handleOpenGameSelector,
    handleCloseGameModal,
  } = useGameSessionLogic();

  useSockets();

  useOnlineSockets();

  return {
    currentUser,
    lastClickedPlayUser,
    gameModals,
    handleCloseGameModal,
    handleOpenGameSelector,
    handleGameClicked,
  };
};
