import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Invite, InviteState } from "../types/invite";

const initialState: InviteState = {
  invites: {},
};

const inviteSlice = createSlice({
  name: "invite",
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

export const acceptGameInvite =
  (gameSocket: any, invite: Invite) => (dispatch: any) => {
    if (gameSocket) {
      console.log(
        `Accepting game invite with opponent ${invite.senderUsername} for game ${invite.gameName}`
      );
      gameSocket.emit("accept-game", {
        opponentUsername: invite.senderUsername,
        gameName: invite.gameName,
      });

      const inviteKey = `${invite.senderUsername}:${invite.gameName}`;
      dispatch(inviteSlice.actions.removeInvite(inviteKey));
    }
  };

export const { receiveInvite, removeInvite, clearInvites } =
  inviteSlice.actions;

export const { reducer: inviteReducer, actions: inviteActions } = inviteSlice;
