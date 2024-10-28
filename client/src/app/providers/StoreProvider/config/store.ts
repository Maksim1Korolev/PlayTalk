import { configureStore } from "@reduxjs/toolkit";

import { invitesReducer } from "@/entities/game/Invites";
import { userReducer } from "@/entities/User";

export const store = configureStore({
  reducer: {
    user: userReducer,
    invites: invitesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
