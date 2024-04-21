import { Player } from "@/entities/Player";
import { User } from "@/entities/User";
import { gameSocket } from "@/shared/api/sockets";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
export interface ChatModalStateProps {
  player: Player;
}

export const useInviteGameSocket = ({
  username,
  data,
}: {
  username: string;
  data?: Player[];
}) => {
  const [inGameUsernames, setInGameUsernames] = useState<string[]>([]);
  const [usersWithGameStatus, setUsersWithGameStatus] = useState<User[]>();
  const [cookies] = useCookies();
  const { user }: { user: User } = cookies["jwt-cookie"];

  const setGameStatus = useCallback(
    (usernames: string[], users?: User[]) => {
      const usersToUpdate = users || usersWithGameStatus;
      if (!usersToUpdate) return;

      const updatedUsers = usersToUpdate.map((user: User) => ({
        ...user,
        inGame: usernames.includes(user.username),
      }));

      setUsersWithGameStatus(updatedUsers);
    },
    [usersWithGameStatus]
  );

  useEffect(() => {
    const onConnect = () => {
      gameSocket.emit("online-ping", username);
    };

    const updateUsersGameStatus = (usernames: string[]) => {
      setInGameUsernames(usernames);
      if (!data) setGameStatus(usernames, data);
    };

    const updatePlayingUsersStatus = (
      username1: string,
      username2: string,
      areInGame: boolean
    ) => {
      setInGameUsernames((prev) => {
        if (areInGame) {
          return [...new Set([...prev, username1, username2])];
        } else {
          return prev.filter((u) => u !== username1 && u !== username2);
        }
      });

      setUsersWithGameStatus((prevUsers) => {
        if (!prevUsers) return [];

        return prevUsers.map((user) => {
          if (user.username === username1 || user.username === username2) {
            return { ...user, inGame: areInGame };
          }
          return user;
        });
      });
    };

    /////////////////////////////////////////////////////
    gameSocket.on("connect", onConnect);
    gameSocket.on("in-game-players", updateUsersGameStatus);
    gameSocket.on("players-started-game", updatePlayingUsersStatus);
    /////////////////////////////////////////////////////

    return () => {
      gameSocket.close();
    };
  }, []);

  const handleUserInvite = (receiverUsername: string) => {
    gameSocket.emit("invite-to-play", {
      senderUsername: user.username,
      receiverUsername,
    });
  };

  return {
    setGameStatus,
    handleUserInvite,
    inGameUsernames,
    usersWithGameStatus,
  };
};

export const useReceiveInvite = (
  receiveInvite: ({ senderUsername }: { senderUsername: string }) => void
) => {
  gameSocket.on("receive-invite", receiveInvite);

  return () => {
    gameSocket.off("receive-invite");
  };
};
