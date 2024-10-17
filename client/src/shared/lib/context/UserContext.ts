import { CurrentUser, User } from "@/entities/User";
import { createContext } from "react";

type UserContextType = {
  currentUser: CurrentUser;
  users: User[];
  updateAllUsers: (users: User[]) => void;
  updateUser: (username: string, updatedProps: Partial<User>) => void;
};

const defaultUsersContext: UserContextType = {
  users: [],
  currentUser: null,
  updateUser: () => {},
  updateAllUsers: () => {},
};

export const UserContext = createContext<UserContextType>(defaultUsersContext);
