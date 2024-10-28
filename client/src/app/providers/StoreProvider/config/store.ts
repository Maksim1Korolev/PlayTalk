import { configureStore } from "@reduxjs/toolkit";

import { inviteReducer } from "@/entities/game/Invite";
import { userReducer } from "@/entities/User";

export const store = configureStore({
  reducer: {
    user: userReducer,
    invite: inviteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
