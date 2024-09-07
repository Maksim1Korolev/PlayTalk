import { createContext } from "react";
import { User } from "@/entities/User";

type UsersContextType = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const defaultUsersContext: UsersContextType = {
  users: [],
  setUsers: () => {}, // Default to a no-op function
};

//TODO:Rename to user singular?
export const UsersContext =
  createContext<UsersContextType>(defaultUsersContext);
