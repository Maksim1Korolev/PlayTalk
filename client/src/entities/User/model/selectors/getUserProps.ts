import { createSelector } from "reselect";

import { StateSchema } from "@/app/providers";

const getUserState = (state: StateSchema) => state.user;

//TODO:Discuss and update to current user's properties
const getUsersMap = createSelector(
  [getUserState],
  (userState) => userState.users
);

export const getUserUnreadMessageCount = (username: string) =>
  createSelector(
    [getUsersMap],
    (users) => users[username]?.unreadMessageCount || 0
  );

export const getUserOnlineStatus = (username: string) =>
  createSelector([getUsersMap], (users) => users[username]?.isOnline || false);

export const getUserAvatarFileName = (username: string) =>
  createSelector(
    [getUsersMap],
    (users) => users[username]?.avatarFileName || ""
  );

export const getUserActiveGames = (username: string) =>
  createSelector([getUsersMap], (users) => users[username]?.activeGames || []);

export const getUserInvitingStatus = (username: string) =>
  createSelector(
    [getUsersMap],
    (users) => users[username]?.isInviting || false
  );

export const getUser = (username: string) =>
  createSelector([getUsersMap], (users) => users[username] || null);
