import { createSelector } from "reselect";

import { StateSchema } from "@/app/providers";

const getUserState = (state: StateSchema) => state.user;

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

export const getUserGameStatusMap = (username: string) =>
  createSelector(
    [getUsersMap],
    (users) => users[username]?.gameStatusMap || {}
  );

export const getUser = (username: string) =>
  createSelector([getUsersMap], (users) => users[username] || null);
