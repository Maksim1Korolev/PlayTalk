import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CurrentUser, User } from "@/entities/User";

import { fetchUsersWithStatuses } from "../thunks/fetchUsersWithStatuses";
import { UserState } from "../types/user";

const getCurrentUserFromLocalStorage = (): CurrentUser | null => {
  if (typeof window !== "undefined") {
    const username = localStorage.getItem("currentUsername");
    if (username) {
      return { username };
    }
  }
  return null;
};

const initialState: UserState = {
  users: {},
  currentUser: getCurrentUserFromLocalStorage(),
  isLoading: false,
  isError: false,
  errorMessage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      if (!state.users[newUser.username]) {
        state.users[newUser.username] = newUser;
      }
    },
    updateUser: (
      state,
      action: PayloadAction<{ username: string; updatedProps: Partial<User> }>
    ) => {
      const { username, updatedProps } = action.payload;
      const user = state.users[username];

      if (user) {
        state.users[username] = { ...user, ...updatedProps };
      }
    },
    setCurrentUser: (state, action: PayloadAction<CurrentUser | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersWithStatuses.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchUsersWithStatuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const users = action.payload;

        const currentUsername = state.currentUser?.username;

        users.forEach((user) => {
          if (user.username === currentUsername) {
            state.currentUser = user;
          } else {
            state.users[user.username] = user;
          }
        });
      })
      .addCase(fetchUsersWithStatuses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { addUser, updateUser, setCurrentUser } = userSlice.actions;
export const { reducer: userReducer, actions: userActions } = userSlice;
