import { CurrentUser, User } from "@/entities/User";
import { createContext } from "react";

type UserContextType = {
  currentUser: CurrentUser;
  users: User[];
  updateUser: (username: string, updatedProps: Partial<User>) => void;
  initializeUsers: (users: User[]) => void;
};

const defaultUsersContext: UserContextType = {
  users: [],
  currentUser: null,
  updateUser: () => {},
  initializeUsers: () => {},
};

export const UserContext = createContext<UserContextType>(defaultUsersContext);
