import { useCallback, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { User } from "@/entities/User";
import { useSockets } from "@/shared/hooks/useSockets";
import { useGameModals } from "./useGameModals";
import { useGameSessionSocket } from "./useGameSessionSocket";
import { useOnlineSockets } from "./useOnlineSockets";
import { Invite, getInviteKey } from "@/entities/Game/model";
import { UsersContext } from "@/shared/lib/context/UsersContext";

export const useOnlinePageSockets = () => {
  const [cookies] = useCookies();
  const { user: currentUser } = cookies["jwt-cookie"];
  const { users, setUsers } = useContext(UsersContext);

  const [inviteMap, setInviteMap] = useState<{ [key: string]: Invite }>({});
  const [lastClickedPlayUser, setLastClickedPlayUser] = useState<User | null>(
    null
  );

  useSockets();

  const updateUsersForList = useCallback(
    (userList: User[]) => {
      if (!currentUser) return;

      const otherUsers = userList.filter(
        (user: User) => user._id !== currentUser._id
      );

      setUsers(otherUsers || []);
    },
    [currentUser, setUsers]
  );

  const updateUserList = useCallback(
    (username: string, updatedProps: Partial<User>) => {
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
    },
    [setUsers]
  );

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

    updateUserList(invite.senderUsername, {
      isInviting: true,
    });
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

  const updateInvitingStatus = (senderUsername: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.username === senderUsername ? { ...user, isInviting: false } : user
      )
    );
  };

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
    updateInvitingStatus(invite.senderUsername);
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
    updateInvitingStatus(invite.senderUsername);
  };

  const handleGameClicked = ({
    opponentUsername,
    gameName,
    isActive,
    isInviting,
  }: {
    opponentUsername: string;
    gameName: string;
    isActive: boolean;
    isInviting: boolean;
  }) => {
    if (isInviting) {
      const invite: Invite = { senderUsername: opponentUsername, gameName };
      handleGameRequestYesButton(invite);
    } else if (isActive) {
      handleOpenGameModal({ opponentUsername, gameName });
    } else {
      handleSendGameInvite({ receiverUsername: opponentUsername, gameName });
    }

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
