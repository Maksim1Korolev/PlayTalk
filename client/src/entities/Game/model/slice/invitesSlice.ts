import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Invite } from "@/entities/Game";

import { InvitesState } from "../types/Invite";

const initialState: InvitesState = {
  invites: {},
};

const invitesSlice = createSlice({
  name: "gameInvites",
  initialState,
  reducers: {
    receiveInvite(state, action: PayloadAction<Invite>) {
      const inviteKey = `${action.payload.senderUsername}:${action.payload.gameName}`;
      state.invites[inviteKey] = action.payload;
    },
    removeInvite(state, action: PayloadAction<string>) {
      delete state.invites[action.payload];
    },
    clearInvites(state) {
      state.invites = {};
    },
  },
});

export const { receiveInvite, removeInvite, clearInvites } =
  invitesSlice.actions;

export const { reducer: invitesReducer, actions: invitesActions } =
  invitesSlice;
