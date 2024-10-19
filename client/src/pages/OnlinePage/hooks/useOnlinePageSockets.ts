import { useContext } from "react";

import { useSockets } from "@/shared/lib/hooks/useSockets";
import { UserContext } from "@/shared/lib/context/UserContext";
import { useGameSessionLogic } from "./useGameSessionLogic";
import { useOnlineSockets } from "./useOnlineSockets";
import { User } from "@/entities/User";

export const useOnlinePageSockets = (users: User[]) => {
  const { currentUser, initializeUsers, updateUser } = useContext(UserContext);

  const {
    lastClickedPlayUser,
    invites,
    gameModals,
    handleGameClicked,
    handleGameRequestYesButton,
    handleGameRequestNoButton,
    handleOpenGameSelector,
    handleCloseGameModal,
  } = useGameSessionLogic(users, updateUser);

  useSockets();

  useOnlineSockets({
    updateUser,
  });

  return {
    currentUser,
    invites,
    lastClickedPlayUser,
    gameModals,
    handleCloseGameModal,
    initializeUsers,
    handleOpenGameSelector,
    handleGameClicked,
    handleGameRequestYesButton,
    handleGameRequestNoButton,
  };
};
