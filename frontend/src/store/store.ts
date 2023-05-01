import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserState } from "./user/userSlice";

export interface RootState {
  user: UserState;
}

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
