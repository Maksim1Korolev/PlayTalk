import { configureStore } from "@reduxjs/toolkit";

import {
  chatApiService,
  gameApiService,
  onlineApiService,
  usersApiService,
} from "@/shared/api";

import { chatReducer } from "@/entities/Chat/model";
import { inviteReducer } from "@/entities/game/Invite";
import { modalReducer } from "@/entities/Modal";
import { userReducer } from "@/entities/User";
import { circleMenuReducer } from "@/features/UserList";
import { authReducer } from "@/pages/AuthPage";

import { ThunkExtraArg } from "./StateSchema";

const extraArg: ThunkExtraArg = {
  api: {
    usersApiService,
    onlineApiService,
    chatApiService,
    gameApiService,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer,
    invite: inviteReducer,
    circleMenu: circleMenuReducer,
    modal: modalReducer,
  },
  devTools: import.meta.env.VITE_NODE_ENV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: extraArg,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
