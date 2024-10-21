import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CircleMenuState } from '../types/circleMenu'



const initialState: CircleMenuState = {
  activeMenuId: null,
};

const circleMenuSlice = createSlice({
  name: "circleMenu",
  initialState,
  reducers: {
    openMenu: (state, action: PayloadAction<string>) => {
      state.activeMenuId = action.payload;
    },
    closeMenu: (state) => {
      state.activeMenuId = null;
    },
  },
});



export const { reducer: CircleMenuReducer, actions: CircleMenuActions } = circleMenuSlice;
