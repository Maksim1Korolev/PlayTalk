import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CurrentUser, User } from "@/entities/User";

import { UserState } from "../types/user";

const initialState: UserState = {
  users: [],
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initializeUsers: (
      state,
      action: PayloadAction<{ users: User[]; currentUser: CurrentUser | null }>
    ) => {
      const { users, currentUser } = action.payload;

      state.currentUser = currentUser;
      state.users = users.filter(
        user => user.username !== currentUser?.username
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
export const { reducer: userReducer, actions: userActions } = userSlice;
