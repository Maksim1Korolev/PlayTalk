import { StateSchema } from "@/app/providers/StoreProvider/config/StateSchema";

export const getInvites = (state: StateSchema) => state.invites.invites;
