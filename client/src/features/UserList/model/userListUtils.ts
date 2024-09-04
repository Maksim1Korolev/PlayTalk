import { User } from "@/entities/User";

export const sortUsers = (userA: User, userB: User): number => {
  // 1. Sort by presence of active games first (users with active games come first)
  const userAHasActiveGames = userA.activeGames && userA.activeGames.length > 0;
  const userBHasActiveGames = userB.activeGames && userB.activeGames.length > 0;

  if (userAHasActiveGames && !userBHasActiveGames) {
    return -1;
  }
  if (!userAHasActiveGames && userBHasActiveGames) {
    return 1;
  }

  // 2. If both have the same active game status, sort by online status (online users come first)
  if (userA.isOnline && !userB.isOnline) {
    return -1;
  }
  if (!userA.isOnline && userB.isOnline) {
    return 1;
  }

  // 3. If both have the same online status, sort alphabetically by username
  return userA.username.localeCompare(userB.username);
};
