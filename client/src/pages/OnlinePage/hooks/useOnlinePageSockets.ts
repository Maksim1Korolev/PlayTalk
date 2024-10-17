import { useContext } from "react";

import { useSockets } from "@/shared/lib/hooks/useSockets";
import { UserContext } from "@/shared/lib/context/UserContext";
import { useGameSessionLogic } from "./useGameSessionLogic";
import { useOnlineSockets } from "./useOnlineSockets";

export const useOnlinePageSockets = () => {
  const { users, currentUser, updateAllUsers, updateUser } =
    useContext(UserContext);

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
    users,
    invites,
    lastClickedPlayUser,
    gameModals,
    handleCloseGameModal,
    updateUsers: updateAllUsers,
    handleOpenGameSelector,
    handleGameClicked,
    handleGameRequestYesButton,
    handleGameRequestNoButton,
  };
};
