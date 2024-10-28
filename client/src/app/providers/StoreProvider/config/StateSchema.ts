import { InviteState } from "@/entities/game/Invite";
import { UserState } from "@/entities/User";

export interface StateSchema {
  user: UserState;
  invite: InviteState;
}
