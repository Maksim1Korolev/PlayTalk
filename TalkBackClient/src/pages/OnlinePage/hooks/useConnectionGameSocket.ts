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
    (usernames: string[], busy: boolean) => {
      console.log("Updating users game status:");
      console.log("Usernames:", usernames);
      console.log("Busy:", busy);

      setUpToDateUsers(prev => {
        const updatedUsers = prev?.map(user => {
          if (usernames.includes(user.username)) {
            console.log(
              `Updating inGame status for user: ${user.username} to ${busy}`
            );
            return {
              ...user,
              inGame: busy,
            };
          }
          return user;
        });
        console.log("Updated users:", updatedUsers);
        return updatedUsers;
      });

      if (usernames.includes(user.username)) {
        console.log(
          `Updating inGame status in cookie for user: ${user.username} to ${busy}`
        );
        setCookie("jwt-cookie", {
          ...cookies["jwt-cookie"],
          user: {
            ...user,
            inGame: busy,
          },
        });
      }
    },
    [setUpToDateUsers, setCookie, cookies, user.username]
  );

  const handleSendGameInvite = useCallback(
    ({ receiverUsername }: { receiverUsername: string }) => {
      console.log(`Sending game invite to: ${receiverUsername}`);
      gameSocket.emit("send-game-invite", { receiverUsername });
    },
    [updateUsersGameStatus, user.username]
  );

  const handleAcceptGame = useCallback(() => {
    console.log("Accepting game invite");
    gameSocket.emit("accept-game");
  }, []);

  const handleEndGame = useCallback(() => {
    console.log("Ending game");
    gameSocket.emit("end-game");
  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log(`Connected as user: ${user.username}`);
      gameSocket.emit("online-ping", user.username);
    };

    const updatePlayingUsersStatus = ({
      usernames,
      busy,
    }: {
      usernames: string[];
      busy: boolean;
    }) => {
      updateUsersGameStatus(usernames, busy);
    };

    gameSocket.on("connect", onConnect);
    gameSocket.on("update-busy-status", updatePlayingUsersStatus);

    return () => {
      gameSocket.off("connect", onConnect);
      gameSocket.off("update-busy-status", updatePlayingUsersStatus);
      gameSocket.close();
    };
  }, []);

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
