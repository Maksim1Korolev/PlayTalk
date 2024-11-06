export type Invite = {
  senderUsername: string;
  gameName: string;
};

export interface InviteState {
  invites: Invite[];
  currentInvite?: Invite;
  currentInviteIndex?: number;
}

export const getInviteKey = (invite: Invite): string => {
  return `${invite.senderUsername}:${invite.gameName}`;
};
