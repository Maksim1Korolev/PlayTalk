export { getCurrentUser, getUsers } from "./selectors/getUsers";
export { getUsersLoadingStatus } from "./selectors/getUserStatus";

export { userActions, userReducer } from "./slice/userSlice";
export type { CurrentUser, User, UserState } from "./types/user";

