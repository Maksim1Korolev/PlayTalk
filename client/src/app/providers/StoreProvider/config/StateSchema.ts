import { InvitesState } from "@/entities/game/Invites";
import { UserState } from "@/entities/User";

export interface StateSchema {
  user: UserState;
  invites: InvitesState;
}
