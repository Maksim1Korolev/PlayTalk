import { GameName } from "@/entities/game/Game";

export type Invite = {
  senderUsername: string;
  gameName: GameName;
};

export interface InviteState {
  invites: Invite[];
  currentInvite?: Invite;
  currentInviteIndex?: number;
}

export const getInviteKey = (invite: Invite): string => {
  return `${invite.senderUsername}:${invite.gameName}`;
};
