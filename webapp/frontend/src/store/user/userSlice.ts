import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../services/cookMaster/types";

export interface UserState {
  userInfo: User | null;
  token: string | null;
}

const initialState: UserState = {
  userInfo: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setToken, setUserInfo } = userSlice.actions;

export default userSlice.reducer;
