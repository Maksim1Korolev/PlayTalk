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
    (usernames: string[], inInvite: boolean, inGame: boolean) => {
      console.log("Updating users game status:");
      console.log("Usernames:", usernames);
      console.log("InInvite:", inInvite);
      console.log("InGame:", inGame);

      setUpToDateUsers(prev => {
        const updatedUsers = prev?.map(user => {
          if (usernames.includes(user.username)) {
            console.log(
              `Updating statuses for user: ${user.username} to inInvite=${inInvite}, inGame=${inGame}`
            );
            return {
              ...user,
              inInvite: inInvite,
              inGame: inGame,
            };
          }
          return user;
        });
        console.log("Updated users:", updatedUsers);
        return updatedUsers;
      });

      if (usernames.includes(user.username)) {
        console.log(
          `Updating statuses in cookie for user: ${user.username} to inInvite=${inInvite}, inGame=${inGame}`
        );
        setCookie("jwt-cookie", {
          ...cookies["jwt-cookie"],
          user: {
            ...user,
            inInvite: inInvite,
            inGame: inGame,
          },
        });
      }
    },
    [setUpToDateUsers, user, setCookie, cookies]
  );

  const handleSendGameInvite = useCallback(
    ({
      receiverUsername,
      game,
    }: {
      receiverUsername: string;
      game: string;
    }) => {
      console.log(`Sending ${game} game invite to: ${receiverUsername}`);
      gameSocket.emit("send-game-invite", { receiverUsername, game });
    },
    []
  );

  const handleAcceptGame = useCallback(() => {
    console.log("Accepting game invite");
    gameSocket.emit("accept-game");
  }, []);

  const handleEndGame = useCallback(() => {
    console.log("Ending game");
    gameSocket.emit("end-game");
  }, []);

  const connectToGame = () => {};
  useEffect(() => {
    const onConnect = () => {
      console.log(`Connected as user: ${user.username}`);
      gameSocket.emit("online-ping", user.username);
    };

    const updateGameStatuses = ({
      usernames,
      inInvite,
      inGame,
    }: {
      usernames: string[];
      inInvite: boolean;
      inGame: boolean;
    }) => {
      updateUsersGameStatus(usernames, inInvite, inGame);
    };

    gameSocket.on("connect", onConnect);
    gameSocket.on("update-game-statuses", updateGameStatuses);
    gameSocket.on("backgammon-connection", connectToGame);

    return () => {
      gameSocket.off("connect", onConnect);
      gameSocket.off("update-game-statuses", updateGameStatuses);
      gameSocket.off("backgammon-connection", connectToGame);
      gameSocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    updateUsersGameStatus,
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
