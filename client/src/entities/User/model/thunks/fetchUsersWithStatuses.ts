import { ThunkConfig } from '@/app/providers';
import { User, } from "@/entities/User";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsersWithStatuses = createAsyncThunk<
  { users: User[]; currentUsername: string },
  { currentUsername: string; token: string },
  ThunkConfig<string>
>(
  "user/fetchUsersWithStatuses",
  async ({ currentUsername, token }, { extra, rejectWithValue }) => {
    const { api } = extra;

    try {
      const users: User[] = await api.usersApiService.getUsers(token);

      const results = await Promise.allSettled([
        api.onlineApiService.getOnlineUsernames(token),
        api.chatApiService.getUnreadMessageCount(currentUsername, token),
        api.gameApiService.getActiveGames(token),
      ]);

      const onlineUsernames: string[] =
        results[0].status === "fulfilled" && Array.isArray(results[0].value)
          ? results[0].value
          : [];

      const unreadMessageCounts =
        results[1].status === "fulfilled" && typeof results[1].value === "object"
          ? results[1].value
          : {};

      const activeGames =
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

      return { users: updatedUsers, currentUsername };
    } catch (err) {
      console.error("Error fetching users status:", err);
      return rejectWithValue(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  }
);
