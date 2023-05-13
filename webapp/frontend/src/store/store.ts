import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./user/userSlice";
import redirectionReducer from "./redirection/redirectionSlice";
import { api } from "./services/cookMaster/api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userReducer,
    redirection: redirectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
