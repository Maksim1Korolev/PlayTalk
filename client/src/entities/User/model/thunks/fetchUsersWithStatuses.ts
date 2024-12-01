import { createAsyncThunk } from "@reduxjs/toolkit";

import { ActiveGames, UnreadMessageCounts } from "@/shared/api";

import { ThunkConfig } from "@/app/providers";
import { GameName } from "@/entities/game/Game";
import { GameStatus } from "@/entities/game/GameStatus";
import { User } from "@/entities/User";

export const fetchUsersWithStatuses = createAsyncThunk<
  User[],
  { token: string },
  ThunkConfig<string>
>(
  "user/fetchUsersWithStatuses",
  async ({ token }, { extra, rejectWithValue }) => {
    const { api } = extra;

    try {
      const users: User[] = await api.usersApiService.getUsers(token);

      const results = await Promise.allSettled([
        api.onlineApiService.getOnlineUsernames(token),
        api.chatApiService.getUnreadMessageCount(token),
        api.gameApiService.getActiveGames(token),
      ]);

      const onlineUsernames: string[] =
        results[0].status === "fulfilled" && Array.isArray(results[0].value)
          ? results[0].value
          : [];

      const unreadMessageCounts: UnreadMessageCounts =
        results[1].status === "fulfilled" &&
        typeof results[1].value === "object"
          ? results[1].value
          : {};

      const activeGames: ActiveGames =
        results[2].status === "fulfilled" &&
        typeof results[2].value === "object"
          ? results[2].value
          : {};

      const onlineSet = new Set(onlineUsernames);

      const updatedUsers = users.map((user: User) => {
        const isOnline = onlineSet.has(user.username);
        const unreadMessageCount = unreadMessageCounts[user.username] || 0;
        const userActiveGames = activeGames[user.username] || [];

        const gameStatusMap: Partial<Record<GameName, GameStatus>> = {};

        userActiveGames.forEach((gameName) => {
          gameStatusMap[gameName] = {
            hasInvitation: false,
            isActive: true,
          };
        });

        return {
          ...user,
          isOnline,
          unreadMessageCount,
          gameStatusMap,
        };
      });

      return updatedUsers;
    } catch (err) {
      console.error("Error fetching users status:", err);
      return rejectWithValue(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  }
);
