import { User } from "@/entities/User";
import { onlineApiService } from "./onlineApiService";
import { usersApiService } from "./usersApiService";
import { gameApiService } from "./gameApiService";

export const fetchUsersStatus = async ({
  setError,
  setIsError,
  setIsLoading,
  token,
  currentUser,
  updateUsers,
}: {
  token: string;
  currentUser: User;
  setError: React.Dispatch<React.SetStateAction<Error | null | undefined>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateUsers: (users: User[]) => void;
}) => {
  setIsLoading(true);
  try {
    const users = await usersApiService.getUsers(token);

    const results = await Promise.allSettled([
      onlineApiService.getOnlineUsernames(token),
      onlineApiService.getUnreadMessageCount(currentUser.username, token),
      gameApiService.getActiveGames(currentUser.username),
    ]);

    const onlineUsernames =
      results[0].status === "fulfilled" ? results[0].value : [];
    const unreadMessageCounts =
      results[1].status === "fulfilled" ? results[1].value : {};
    const activeGames =
      results[2].status === "fulfilled" ? results[2].value : {};
    const onlineSet = new Set(onlineUsernames);

    const updatedUsers = users.map((user: User) => ({
      ...user,
      isOnline: onlineSet.has(user.username),
      unreadMessageCount: unreadMessageCounts[user.username] || 0,
      activeGames: activeGames[user.username] || [],
    }));

    updateUsers(updatedUsers);
    setIsLoading(false);
    setIsError(false);
    setError(null);
  } catch (err: unknown) {
    setIsLoading(false);
    setIsError(true);
    if (err instanceof Error) {
      setError(err);
    } else {
      setError(new Error("An unknown error occurred"));
    }
  }
};
