import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  email: string;
  token: string | null;
}

const initialState: UserState = {
  email: "",
  token: null,
};

export const counterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    resetEmail: (state) => {
      state.email = "";
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { setEmail, resetEmail, setToken } = counterSlice.actions;

export default counterSlice.reducer;
