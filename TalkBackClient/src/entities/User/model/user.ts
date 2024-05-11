export interface User {
  _id: string;
  username: string;
  password: string;
  avatarPath: string;
  isOnline: boolean;
  inInvite: boolean;
  inGame: boolean;
  unreadMessageCount?: number;
}
