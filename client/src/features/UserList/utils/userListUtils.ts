import { User } from "@/entities/User";

export const sortUsers = (userA: User, userB: User): number => {
  // 1. Sort by 'isInviting' (users who are currently inviting come first)
  if (userA.isInviting && !userB.isInviting) {
    return -1;
  }
  if (!userA.isInviting && userB.isInviting) {
    return 1;
  }

  // 2. Sort by presence of active games (users with active games come first)
  const userAHasActiveGames = userA.activeGames && userA.activeGames.length > 0;
  const userBHasActiveGames = userB.activeGames && userB.activeGames.length > 0;

  if (userAHasActiveGames && !userBHasActiveGames) {
    return -1;
  }
  if (!userAHasActiveGames && userBHasActiveGames) {
    return 1;
  }

  // 3. Sort by online status (online users come first)
  if (userA.isOnline && !userB.isOnline) {
    return -1;
  }
  if (!userA.isOnline && userB.isOnline) {
    return 1;
  }

  // 4. Sort alphabetically by username if everything else is the same
  return userA.username.localeCompare(userB.username);
};
