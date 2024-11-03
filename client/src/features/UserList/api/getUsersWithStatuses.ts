import {
  ActiveGames,
  chatApiService,
  gameApiService,
  onlineApiService,
  UnreadMessageCounts,
  usersApiService,
} from "@/shared/api";

import { User } from "@/entities/User";

interface FetchUsersStatusParams {
  currentUsername: string;
  token: string;
  setError: React.Dispatch<React.SetStateAction<Error | null | undefined>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const getUsersWithStatuses = async ({
  currentUsername,
  token,
  setError,
  setIsError,
  setIsLoading,
}: FetchUsersStatusParams): Promise<User[]> => {
  setIsLoading(true);

  try {
    const users: User[] = await usersApiService.getUsers(token);
    console.log("Fetched users:");
    console.log(users);

    // TODO: No need to pass currentUsername (has to be changed on the servers)
    const results = await Promise.allSettled([
      onlineApiService.getOnlineUsernames(token),
      chatApiService.getUnreadMessageCount(currentUsername, token),
      gameApiService.getActiveGames(token),
    ]);

    const onlineUsernames: string[] =
      results[0].status === "fulfilled" && Array.isArray(results[0].value)
        ? results[0].value
        : [];

    const unreadMessageCounts: UnreadMessageCounts =
      results[1].status === "fulfilled" && typeof results[1].value === "object"
        ? results[1].value
        : {};

    const activeGames: ActiveGames =
      results[2].status === "fulfilled" && typeof results[2].value === "object"
        ? results[2].value
        : {};

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
    return [];
  }
};
