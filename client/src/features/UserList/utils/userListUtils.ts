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

  // 4. Sort by unread messages (users with unread messages come first)
  const userAHasUnreadMessages =
    userA.unreadMessageCount && userA.unreadMessageCount > 0;
  const userBHasUnreadMessages =
    userB.unreadMessageCount && userB.unreadMessageCount > 0;

  if (userAHasUnreadMessages && !userBHasUnreadMessages) {
    return -1;
  }
  if (!userAHasUnreadMessages && userBHasUnreadMessages) {
    return 1;
  }

  // 5. Sort alphabetically by username if everything else is the same
  return userA.username.localeCompare(userB.username);
};
