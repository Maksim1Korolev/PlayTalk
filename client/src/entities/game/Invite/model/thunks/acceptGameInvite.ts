import { createAsyncThunk } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { ThunkConfig } from "@/app/providers";

import { inviteActions } from "../slice/inviteSlice";
import { Invite } from "../types/invite";

export const acceptGameInvite = createAsyncThunk<
  {},
  {
    gameSocket?: Socket | null;
    invite: Invite;
  },
  ThunkConfig<string>
>("chat/sendMessage", async ({ gameSocket, invite }, { dispatch }) => {
  if (gameSocket) {
    console.log(
      `Accepting game invite with opponent ${invite.senderUsername} for game ${invite.gameName}`
    );

    gameSocket.emit("accept-game", {
      opponentUsername: invite.senderUsername,
      gameName: invite.gameName,
    });
  }

  dispatch(inviteActions.removeInvite(invite));
});
