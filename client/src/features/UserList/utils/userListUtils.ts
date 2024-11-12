import { User } from "@/entities/User";

export const sortUsers = (userA: User, userB: User): number => {
  const isUserInviting = (user: User): boolean => {
    return Object.values(user.gameStatusMap || {}).some(
      (status) => status.hasInvitation === true
    );
  };

  const doesUserHaveActiveGames = (user: User): boolean => {
    return Object.values(user.gameStatusMap || {}).some(
      (status) => status.isActive === true
    );
  };

  // 1. Sort by 'isInviting' (users who are currently inviting come first)
  const userAIsInviting = isUserInviting(userA);
  const userBIsInviting = isUserInviting(userB);

  if (userAIsInviting && !userBIsInviting) {
    return -1;
  }
  if (!userAIsInviting && userBIsInviting) {
    return 1;
  }

  // 2. Sort by presence of active games (users with active games come first)
  const userAHasActiveGames = doesUserHaveActiveGames(userA);
  const userBHasActiveGames = doesUserHaveActiveGames(userB);

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
  const userAHasUnreadMessages = (userA.unreadMessageCount ?? 0) > 0;
  const userBHasUnreadMessages = (userB.unreadMessageCount ?? 0) > 0;

  if (userAHasUnreadMessages && !userBHasUnreadMessages) {
    return -1;
  }
  if (!userAHasUnreadMessages && userBHasUnreadMessages) {
    return 1;
  }

  // 5. Sort alphabetically by username if everything else is the same
  return userA.username.localeCompare(userB.username);
};
