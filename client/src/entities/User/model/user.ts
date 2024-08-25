//TODO:Make into type?
export interface User {
  _id: string;
  username: string;
  password: string;
  avatarFileName: string;
  isOnline: boolean;
  activeGames: string[];
  unreadMessageCount?: number;
  isChatOpen?: boolean;
}
