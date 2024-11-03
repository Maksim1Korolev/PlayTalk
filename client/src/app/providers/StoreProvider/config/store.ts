import { configureStore } from "@reduxjs/toolkit";

import { $api } from "@/shared/api";

import { inviteReducer } from "@/entities/game/Invite";
import { modalReducer } from "@/entities/Modal";
import { userReducer } from "@/entities/User";
import { circleMenuReducer } from "@/features/UserList";

import { ThunkExtraArg } from "./StateSchema";

const extraArg: ThunkExtraArg = {
  api: $api,
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    invite: inviteReducer,
    circleMenu: circleMenuReducer,
    modal: modalReducer,
  },
  devTools: import.meta.env.VITE_NODE_ENV,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: extraArg,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
