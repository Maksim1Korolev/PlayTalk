import { User } from "@/entities/User";
import { useCallback, useState } from "react";
import { useOnlineSocket } from "./useOnlineSocket";
import { useCookies } from "react-cookie";
import { useGameSessionSocket } from "./useGameSessionSocket";

//TODO: Separate users update, so that if game Server crashes, online will work
export const useOnlinePageSockets = () => {
  const [cookies] = useCookies();
  const { user: currentUser } = cookies["jwt-cookie"];
  const [upToDateUsers, setUpToDateUsers] = useState<User[]>();
  const [inviteData, setInviteData] = useState<{
    senderUsername: string;
    game: string;
  } | null>(null);

  const updateUsers = useCallback(
    (users: User[]) => {
      const otherUsers = users.filter(
        (user: User) => user._id !== currentUser._id
      );
      setUpToDateUsers(otherUsers);

      const userWithGameStatuses = users.find(
        user => user.username === currentUser.username
      );
      if (userWithGameStatuses) {
        console.log(userWithGameStatuses?.inGame);
      }
    },
    [currentUser]
  );

  useOnlineSocket({
    upToDateUsers,
    setUpToDateUsers,
  });

  const onReceiveInvite = ({
    senderUsername,
    game,
  }: {
    senderUsername: string;
    game: string;
  }) => {
    setInviteData({ senderUsername, game });
  };

  const { handleSendGameInvite, handleAcceptGame } = useGameSessionSocket({
    onReceiveInvite,
  });

  return {
    upToDateUsers,
    inviteData,
    updateUsers,
    handleSendGameInvite,
    handleAcceptGame,
  };
};
