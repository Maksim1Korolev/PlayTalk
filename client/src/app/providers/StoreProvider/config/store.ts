import { userReducer } from "@/entities/User/model/slice/userSlice"
import { CircleMenuReducer } from '@/features/UserList'
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    user: userReducer,
		circleMenu: CircleMenuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
