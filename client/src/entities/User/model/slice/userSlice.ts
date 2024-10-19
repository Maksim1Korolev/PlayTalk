import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, CurrentUser } from "@/entities/User";
import { UserState } from "../types/user";

const initialState: UserState = {
  users: [],
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initializeUsers: (state, action: PayloadAction<User[]>) => {
      const users = action.payload;
      const currentUserFromCookies = users.find(
        user => user.username === state.currentUser?.username
      );

      state.currentUser = currentUserFromCookies || state.currentUser;
      state.users = users.filter(
        user => user.username !== state.currentUser?.username
      );
    },
    updateUser: (
      state,
      action: PayloadAction<{ username: string; updatedProps: Partial<User> }>
    ) => {
      const { username, updatedProps } = action.payload;
      const user = state.users.find(user => user.username === username);

      if (user) {
        Object.assign(user, updatedProps);
      }
    },
    setCurrentUser: (state, action: PayloadAction<CurrentUser | null>) => {
      state.currentUser = action.payload;
    },
  },
});

export const { initializeUsers, updateUser, setCurrentUser } =
  userSlice.actions;
export default userSlice.reducer;
