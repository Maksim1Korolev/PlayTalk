import { User } from "@/entities/User";
import { useQuery } from "react-query";
import { gameConnectionApiService } from "./gameConnectionApiService";
import { onlineApiService } from "./onlineApiService";
import { usersApiService } from "./usersApiService";

export const useUsersStatus = async (
  token: string,
  updateUsers: (users: User[]) => void,
  currentUser: User
) => {
  return useQuery<User[], Error>(
    "userStatuses",
    async () => {
      const users = await usersApiService.getUsers(token);

      const onlineUsernames = await onlineApiService.getOnlineUsernames(token);

      const usersInGame = await gameConnectionApiService.getInGameUsernames(
        token
      );

      const onlineSet = new Set(onlineUsernames);
      const inGameSet = new Set(usersInGame);

      const updatedUsers = users.map((user: User) => ({
        ...user,
        isOnline: onlineSet.has(user.username),
        inGame: inGameSet.has(user.username),
      }));

      console.log("Updated Users:", updatedUsers);
      return updatedUsers;
    },
    {
      enabled: !!token,
      onSuccess: (fetchedUsers: User[]) => {
        const otherUsers = fetchedUsers.filter(
          (user) => user._id !== currentUser._id
        );

        updateUsers(otherUsers);
      },
    }
  );
};
