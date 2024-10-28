import { InvitesState } from "@/entities/Game";
import { UserState } from "@/entities/User";

export interface StateSchema {
  user: UserState;
  invites: InvitesState;
}
