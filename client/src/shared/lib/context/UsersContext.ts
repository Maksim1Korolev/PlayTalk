import { CurrentUser, User } from "@/entities/User";
import { createContext } from "react";

type UsersContextType = {
  currentUser: CurrentUser;
  users: User[];
  updateAllUsers: (users: User[]) => void;
  updateUser: (username: string, updatedProps: Partial<User>) => void;
};

const defaultUsersContext: UsersContextType = {
  users: [],
  currentUser: null,
  updateUser: () => {},
  updateAllUsers: () => {},
};

//TODO:Rename to user singular?
export const UsersContext =
  createContext<UsersContextType>(defaultUsersContext);
