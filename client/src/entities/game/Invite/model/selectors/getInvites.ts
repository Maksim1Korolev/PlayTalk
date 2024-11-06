import { StateSchema } from "@/app/providers";

export const getCurrentInvite = (state: StateSchema) =>
  state.invite.currentInvite;
