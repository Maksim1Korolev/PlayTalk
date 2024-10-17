import { useContext } from "react";

import { useSockets } from "@/shared/lib/hooks/useSockets";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { useGameSessionLogic } from "./useGameSessionLogic";
import { useOnlineSockets } from "./useOnlineSockets";

export const useOnlinePageSockets = () => {
  const { users, currentUser, updateAllUsers, updateUser } =
    useContext(UsersContext);

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
