import { useCallback, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { User } from "@/entities/User";
import { useSockets } from "@/shared/hooks/useSockets";
import { useGameModals } from "./useGameModals";
import { useGameSessionSocket } from "./useGameSessionSocket";
import { useOnlineSockets } from "./useOnlineSockets";
import { Invite, getInviteKey } from "@/entities/Game/model";

export const useOnlinePageSockets = () => {
  const [cookies] = useCookies();
  const { user: currentUser } = cookies["jwt-cookie"];

  const [users, setUsers] = useState<User[]>([]);
  //TODO:Move
  const [inviteMap, setInviteMap] = useState<{ [key: string]: Invite }>({});
  const [lastClickedPlayUser, setLastClickedPlayUser] = useState<User | null>(
    null
  );

  useSockets();

  const updateUsersForList = useCallback(
    (users: User[]) => {
      if (!currentUser) return;
      const otherUsers = users.filter(
        (user: User) => user._id !== currentUser._id
      );
      setUsers(otherUsers || []);
    },
    [currentUser]
  );

  const updateUserList = (username: string, updatedProps: Partial<User>) => {
    setUsers((prevUsers: User[]) => {
      if (!prevUsers) return [];

      return prevUsers.map(user => {
        if (user.username === username) {
          const { _id, username, avatarFileName, ...allowedProps } =
            updatedProps;
          return { ...user, ...allowedProps };
        }

        return user;
      });
    });
  };

  useOnlineSockets({
    updateUserList,
  });

  const handleOpenGameSelector = useCallback((user: User) => {
    setLastClickedPlayUser(user);
  }, []);

  const onReceiveInvite = (invite: Invite) => {
    const inviteKey = getInviteKey(invite);

    setInviteMap(prevInvites => ({
      ...prevInvites,
      [inviteKey]: invite,
    }));
  };

  const getUser = (username: string): User | undefined => {
    return users?.find(user => user.username === username);
  };

  const onGameStart = ({
    opponentUsername,
    gameName,
  }: {
    opponentUsername: string;
    gameName: string;
  }) => {
    updateUserList(opponentUsername, {
      activeGames: [
        ...(getUser(opponentUsername)?.activeGames || []),
        gameName,
      ],
    });

    handleOpenGameModal({ opponentUsername, gameName });
  };

  const onGameEnd = ({
    opponentUsername,
    gameName,
    winner,
  }: {
    opponentUsername: string;
    gameName: string;
    winner: string;
  }) => {
    updateUserList(opponentUsername, {
      activeGames: (getUser(opponentUsername)?.activeGames || []).filter(
        game => game !== gameName
      ),
    });

    handleCloseGameModal({ opponentUsername, gameName });
  };

  const { gameModals, handleOpenGameModal, handleCloseGameModal } =
    useGameModals();

  const { handleSendGameInvite, handleAcceptGame } = useGameSessionSocket({
    onReceiveInvite,
    onGameStart,
    onGameEnd,
  });

  const handleGameRequestYesButton = (invite: Invite) => {
    handleAcceptGame({
      opponentUsername: invite.senderUsername,
      gameName: invite.gameName,
    });
    const inviteKey = getInviteKey(invite);
    setInviteMap(prevInvites => {
      const { [inviteKey]: removed, ...remainingInvites } = prevInvites;
      return remainingInvites;
    });
  };

  const handleGameRequestNoButton = (invite: Invite) => {
    const inviteKey = getInviteKey({
      senderUsername: invite.senderUsername,
      gameName: invite.gameName,
    });
    setInviteMap(prevInvites => {
      const { [inviteKey]: removed, ...remainingInvites } = prevInvites;
      return remainingInvites;
    });
  };

  const handleGameClicked = ({
    opponentUsername,
    gameName,
    isActive,
  }: {
    opponentUsername: string;
    gameName: string;
    isActive: boolean;
  }) => {
    isActive
      ? handleOpenGameModal({ opponentUsername, gameName })
      : handleSendGameInvite({ receiverUsername: opponentUsername, gameName });

    setLastClickedPlayUser(null);
  };

  return {
    users,
    invites: Object.values(inviteMap),
    lastClickedPlayUser,
    gameModals,
    onGameModalClose: handleCloseGameModal,
    updateUsers: updateUsersForList,
    handleOpenGameSelector,
    handleGameClicked,
    handleGameRequestYesButton,
    handleGameRequestNoButton,
  };
};
