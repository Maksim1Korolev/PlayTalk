import { User } from "@/entities/User";
import { useCallback, useEffect, useState } from "react";
import { useOnlineSocket } from "./useOnlineSocket";
import { useInviteGameSocket, useReceiveInvite } from "./useInviteGameSocket";

export const useOnlinePageSockets = ({ data }: { data?: User[] }) => {
  const [isInvitedToGame, setIsInvitedToGame] = useState(false);
  const [gameInviteSenderUsername, setGameInviteSenderUsername] = useState("");
  const [usersWithUpdatedStatus, setUsersWithUpdatedStatus] =
    useState<User[]>();

  const updateUsersStatus = (users: User[]) => {
    const usersWithOnlineStatus = setUsersOnline(onlineUsernames, users);
    setUsersGameStatus(inGameUsernames, usersWithOnlineStatus);
    setUsersWithUpdatedStatus(usersWithGameStatus);
  };

  const {
    onlineUsernames,
    usersWithOnlineStatus,
    chatModals,
    setChatModals,
    setUsersOnline,
    handleUserMessage,
  } = useOnlineSocket({
    data,
  });

  const {
    inGameUsernames,
    usersWithGameStatus,
    setUsersGameStatus,
    handleUserInvite,
  } = useInviteGameSocket({
    data: usersWithOnlineStatus,
  });

  const receiveInviteSubscribe = useCallback(
    ({ senderUsername }: { senderUsername: string }) => {
      console.log(senderUsername);
      setGameInviteSenderUsername(senderUsername);
      setIsInvitedToGame(true);
    },
    []
  );
  useEffect(() => {
    const disconnect = useReceiveInvite(receiveInviteSubscribe);
    return () => {
      disconnect();
    };
  }, []);

  return {
    usersWithUpdatedStatus,
    isInvitedToGame,
    gameInviteSenderUsername,
    chatModals,
    setChatModals,
    updateUsersStatus,
    handleUserMessage,
    handleUserInvite,
  };
};
