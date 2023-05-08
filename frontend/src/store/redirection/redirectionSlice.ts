import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RedirectionState {
  route: string | null;
}

const initialState: RedirectionState = {
  route: null,
};

export const redirectionSlice = createSlice({
  name: "redirection",
  initialState,
  reducers: {
    setRedirection: (state, action: PayloadAction<string>) => {
      state.route = action.payload;
    },
    resetRedirection: (state) => {
      state.route = null;
    },
  },
});

export const { setRedirection, resetRedirection } = redirectionSlice.actions;

export default redirectionSlice.reducer;
