import { User } from "@/entities/User";
import { gameSocket } from "@/shared/api/sockets";
import { useCallback, useEffect } from "react";
import { useCookies } from "react-cookie";

export const useConnectionGameSocket = ({
  setUpToDateUsers,
}: {
  setUpToDateUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>;
}) => {
  const [cookies, setCookie] = useCookies(["jwt-cookie"]);
  const { user }: { user: User } = cookies["jwt-cookie"];

  const updateUsersGameStatus = useCallback(
    (usernames: string[]) => {
      setUpToDateUsers(prev =>
        prev?.map(user => ({
          ...user,
          inGame: usernames.includes(user.username),
        }))
      );

      setCookie("jwt-cookie", {
        ...cookies,
        user: {
          ...user,
          inGame: usernames.includes(user.username),
        },
      });
    },
    [setUpToDateUsers]
  );

  const handleSendGameInvite = useCallback(
    ({ receiverUsername }: { receiverUsername: string }) => {
      updateUsersGameStatus([user.username, receiverUsername]);
      gameSocket.emit("send-game-invite", { receiverUsername });
    },
    [updateUsersGameStatus, user.username]
  );

  const handleAcceptGame = useCallback(() => {
    gameSocket.emit("accept-game");
  }, []);

  const handleEndGame = useCallback(() => {
    gameSocket.emit("end-game");
  }, []);

  useEffect(() => {
    const onConnect = () => {
      gameSocket.emit("online-ping", user.username);
    };

    const updatePlayingUsersStatus = ({
      usernames,
      busy,
    }: {
      usernames: string[];
      busy: boolean;
    }) => {
      updateUsersGameStatus(busy ? usernames : []);
    };

    gameSocket.on("connect", onConnect);
    gameSocket.on("update-busy-status", updatePlayingUsersStatus);

    return () => {
      gameSocket.off("connect", onConnect);
      gameSocket.off("update-busy-status", updatePlayingUsersStatus);
      gameSocket.close();
    };
  }, [updateUsersGameStatus, user.username]);

  return {
    handleSendGameInvite,
    handleAcceptGame,
    handleEndGame,
  };
};

export const useReceiveInvite = (
  receiveInvite: ({ senderUsername }: { senderUsername: string }) => void
) => {
  useEffect(() => {
    gameSocket.on("receive-game-invite", receiveInvite);
    return () => {
      gameSocket.off("receive-game-invite", receiveInvite);
    };
  }, [receiveInvite]);
};

export const useConnectToGame = (
  connectToGame: ({ opponentUsername }: { opponentUsername: string }) => void
) => {
  useEffect(() => {
    gameSocket.on("backgammon-connection", connectToGame);
    return () => {
      gameSocket.off("backgammon-connection", connectToGame);
    };
  }, [connectToGame]);
};
