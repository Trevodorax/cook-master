import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  email: string;
}

const initialState: UserState = {
  email: "",
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
  },
});

export const { setEmail, resetEmail } = counterSlice.actions;

export default counterSlice.reducer;
