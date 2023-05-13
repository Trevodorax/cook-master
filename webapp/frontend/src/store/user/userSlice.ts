import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "../services/cookMaster/api";

export interface UserState {
  userInfo: UserInfo | null;
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
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setToken, setUserInfo } = userSlice.actions;

export default userSlice.reducer;
