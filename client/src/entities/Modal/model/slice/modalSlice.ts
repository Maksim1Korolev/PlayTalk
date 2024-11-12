import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Modal, ModalState } from "../types/modal";

const initialState: ModalState = {
  modals: [],
  modalCount: 0,
  modalMaxCount: 5,
};

const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    addModal: (state, action: PayloadAction<Modal>) => {
      state.modals.push(action.payload);
      state.modalCount += 1;
    },
    removeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(
        (modal) => modal.modalId !== action.payload
      );
      state.modalCount = Math.max(state.modalCount - 1, 0);
    },
    resetModalCount: (state) => {
      state.modalCount = 0;
    },
  },
});

export const { actions: modalActions, reducer: modalReducer } = modalSlice;
