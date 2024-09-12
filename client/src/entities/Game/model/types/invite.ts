export type Invite = {
  senderUsername: string;
  gameName: string;
};

export const getInviteKey = (invite: Invite): string => {
  return `${invite.senderUsername}-${invite.gameName}`;
};
