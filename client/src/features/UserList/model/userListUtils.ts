import { User } from "@/entities/User";

export const sortUsers = (userA: User, userB: User): number => {
  // Sort by online status first (online users come first)
  if (userA.isOnline && !userB.isOnline) {
    return -1;
  }
  if (!userA.isOnline && userB.isOnline) {
    return 1;
  }

  // If both are in the same inGame status, sort alphabetically by username
  return userA.username.localeCompare(userB.username);
};
