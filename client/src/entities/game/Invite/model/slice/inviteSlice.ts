import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { acceptGameInvite } from "../thunks/acceptGameInvite";
import { Invite, InviteState } from "../types/invite";

const initialState: InviteState = {
  invites: [],
  currentInvite: undefined,
  currentInviteIndex: undefined,
};

const inviteSlice = createSlice({
  name: "invite",
  initialState,
  reducers: {
    receiveInvite(state, action: PayloadAction<Invite>) {
      state.invites.push(action.payload);
      if (state.invites.length === 1) {
        state.currentInvite = action.payload;
        state.currentInviteIndex = 0;
      }
    },
    removeInvite(state, action: PayloadAction<Invite>) {
      const inviteToRemove = action.payload;
      const index = state.invites.findIndex(
        (invite) =>
          invite.senderUsername === inviteToRemove.senderUsername &&
          invite.gameName === inviteToRemove.gameName
      );

      if (index !== -1) {
        state.invites.splice(index, 1);

        if (state.invites.length > 0) {
          if (state.currentInviteIndex !== undefined) {
            if (index < state.currentInviteIndex) {
              state.currentInviteIndex -= 1;
            } else if (index === state.currentInviteIndex) {
              state.currentInviteIndex =
                state.currentInviteIndex < state.invites.length
                  ? state.currentInviteIndex
                  : 0;
              state.currentInvite = state.invites[state.currentInviteIndex];
            }
          }
        } else {
          state.currentInvite = undefined;
          state.currentInviteIndex = undefined;
        }
      }
    },
    skipInvite(state) {
      if (state.invites.length > 0 && state.currentInviteIndex !== undefined) {
        const newIndex =
          state.currentInviteIndex < state.invites.length - 1
            ? state.currentInviteIndex + 1
            : 0;
        state.currentInviteIndex = newIndex;
        state.currentInvite = state.invites[newIndex];
      }
    },
    clearInvites(state) {
      state.invites = [];
      state.currentInvite = undefined;
      state.currentInviteIndex = undefined;
    },
  },
});

export const { receiveInvite, removeInvite, skipInvite, clearInvites } =
  inviteSlice.actions;

export const { reducer: inviteReducer, actions: inviteActions } = inviteSlice;
