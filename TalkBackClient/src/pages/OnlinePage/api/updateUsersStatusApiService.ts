import { User } from "@/entities/User";
import { gameConnectionApiService } from "./gameConnectionApiService";
import { onlineApiService } from "./onlineApiService";
import { usersApiService } from "./usersApiService";

export const fetchUsersStatus = async (
  token: string,
  currentUser: User
): Promise<User[]> => {
  const users = await usersApiService.getUsers(token);

  const results = await Promise.allSettled([
    onlineApiService.getOnlineUsernames(token),
    gameConnectionApiService.getInGameUsernames(token),
    onlineApiService.getUnreadMessageCount(currentUser.username, token),
  ]);

  const onlineUsernames =
    results[0].status === "fulfilled" ? results[0].value : [];
  const inGameUsernames =
    results[1].status === "fulfilled" ? results[1].value : [];
  const unreadMessageCounts =
    results[2].status === "fulfilled" ? results[2].value : {};

  const onlineSet = new Set(onlineUsernames);
  const inGameSet = new Set(inGameUsernames);

  const updatedUsers = users.map((user: User) => ({
    ...user,
    isOnline: onlineSet.has(user.username),
    inGame: inGameSet.has(user.username),
    unreadMessageCount: unreadMessageCounts[user.username] || 0,
  }));

  return updatedUsers;
};
