import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    removeInvite(state) {
      if (state.currentInviteIndex !== undefined) {
        state.invites.splice(state.currentInviteIndex, 1);

        if (state.invites.length > 0) {
          state.currentInviteIndex =
            state.currentInviteIndex < state.invites.length
              ? state.currentInviteIndex
              : 0;
          state.currentInvite = state.invites[state.currentInviteIndex];
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

export const acceptGameInvite =
  (gameSocket: any) => (dispatch: any, getState: any) => {
    const {
      invite: { currentInvite },
    } = getState();

    if (gameSocket && currentInvite) {
      console.log(
        `Accepting game invite with opponent ${currentInvite.senderUsername} for game ${currentInvite.gameName}`
      );
      gameSocket.emit("accept-game", {
        opponentUsername: currentInvite.senderUsername,
        gameName: currentInvite.gameName,
      });

      dispatch(inviteSlice.actions.removeInvite());
    }
  };

export const { receiveInvite, removeInvite, skipInvite, clearInvites } =
  inviteSlice.actions;

export const { reducer: inviteReducer, actions: inviteActions } = inviteSlice;
