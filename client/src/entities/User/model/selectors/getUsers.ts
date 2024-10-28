import { StateSchema } from "@/app/providers";

export const getUsers = (state: StateSchema) => state.user.users;
export const getCurrentUser = (state: StateSchema) => state.user.currentUser;
