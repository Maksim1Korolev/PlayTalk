import { User } from "@/entities/User";
import { useCallback, useState } from "react";
import {
  useConnectionGameSocket,
  useReceiveInvite,
} from "./useConnectionGameSocket";
import { useOnlineSocket } from "./useOnlineSocket";
import { useCookies } from "react-cookie";
import { useGameSessionSocket } from "./useGameSessionSocket";

//TODO: Separate users update, so that if game Server crashes, online will work
export const useOnlinePageSockets = () => {
  const [cookies] = useCookies();
  const { user: currentUser } = cookies["jwt-cookie"];
  const [isInvitedToGame, setIsInvitedToGame] = useState(false);
  const [upToDateUsers, setUpToDateUsers] = useState<User[]>();
  const [gameInviteSenderUsername, setGameInviteSenderUsername] = useState("");
  useState<User[]>();

  const updateUsers = useCallback((users: User[]) => {
    const otherUsers = users.filter(
      (user: User) => user._id !== currentUser._id
    );
    setUpToDateUsers(otherUsers);

    const userWithGameStatuses = users.find(
      user => user.username === currentUser.username
    );
    if (userWithGameStatuses) {
      console.log(userWithGameStatuses?.inGame);

      // updateUsersGameStatus(
      //   [userWithGameStatuses.username],
      //   userWithGameStatuses?.inInvite,
      //   userWithGameStatuses?.inGame
      // );
    }
  }, []);

  useOnlineSocket({
    upToDateUsers,
    setUpToDateUsers,
  });

  // const {
  //   handleSendGameInvite,
  //   handleAcceptGame,
  //   handleEndGame,
  //   updateUsersGameStatus,
  // } = useConnectionGameSocket({
  //   setUpToDateUsers,
  // });

  // const receiveInviteSubscribe = useCallback(
  //   ({ senderUsername }: { senderUsername: string }) => {
  //     setGameInviteSenderUsername(senderUsername);
  //     setIsInvitedToGame(true);
  //   },
  //   []
  // );

  //useReceiveInvite(receiveInviteSubscribe);

  //////

  const { handleSendGameInvite, handleAcceptGame } = useGameSessionSocket();
  return {
    upToDateUsers,
    isInvitedToGame,
    updateUsers,
    handleSendGameInvite,
    handleAcceptGame,
  };
};
