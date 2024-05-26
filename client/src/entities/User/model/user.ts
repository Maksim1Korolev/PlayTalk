export interface User {
  _id: string;
  username: string;
  password: string;
  avatarFileName: string;
  isOnline: boolean;
  inInvite: boolean;
  inGame: boolean;
  unreadMessageCount?: number;
	isChatOpen?: boolean;
}
