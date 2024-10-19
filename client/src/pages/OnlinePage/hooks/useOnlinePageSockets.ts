import { useContext } from "react";

import { useSockets } from "@/shared/lib";
import { useAppSelector } from "@/shared/lib";
import { UserContext } from "@/shared/lib/context/UserContext";

import {
  getCurrentUser,
  getUsers,
} from "@/entities/User/model/selectors/getUsers";

import { useGameSessionLogic } from "./useGameSessionLogic";
import { useOnlineSockets } from "./useOnlineSockets";

export const useOnlinePageSockets = () => {
  const { updateUser } = useContext(UserContext);

  const users = useAppSelector(getUsers);
  const currentUser = useAppSelector(getCurrentUser);

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

  useOnlineSockets();

  return {
    currentUser,
    invites,
    lastClickedPlayUser,
    gameModals,
    handleCloseGameModal,
    handleOpenGameSelector,
    handleGameClicked,
    handleGameRequestYesButton,
    handleGameRequestNoButton,
  };
};
