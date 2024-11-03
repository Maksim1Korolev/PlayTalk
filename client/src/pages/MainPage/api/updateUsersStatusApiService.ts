import { User } from "@/entities/User";

import { communicationApiService } from "./communicationApiService";
import { gameApiService } from "./gameApiService";
import { usersApiService } from "./usersApiService";

interface FetchUsersStatusParams {
  currentUsername: string;
  token: string;
  setError: React.Dispatch<React.SetStateAction<Error | null | undefined>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

//TODO:Rename and move
export const fetchUsersStatus = async ({
  currentUsername,
  token,
  setError,
  setIsError,
  setIsLoading,
}: FetchUsersStatusParams) => {
  setIsLoading(true);

  try {
    const users = await usersApiService.getUsers(token);

    const results = await Promise.allSettled([
      communicationApiService.getOnlineUsernames(token),
      communicationApiService.getUnreadMessageCount(currentUsername, token),
      gameApiService.getActiveGames(token, currentUsername),
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

    setIsLoading(false);
    setIsError(false);
    setError(null);

    return updatedUsers;
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
