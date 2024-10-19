import { StateSchema } from "@/app/providers/StoreProvider/config/StateSchema";

export const getUsers = (state: StateSchema) => state.user.users;
export const getCurrentUser = (state: StateSchema) => state.user.currentUser;
