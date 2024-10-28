export type Invite = {
  senderUsername: string;
  gameName: string;
};

export interface InvitesState {
  invites: { [key: string]: Invite };
}

export const getInviteKey = (invite: Invite): string => {
  return `${invite.senderUsername}-${invite.gameName}`;
};
