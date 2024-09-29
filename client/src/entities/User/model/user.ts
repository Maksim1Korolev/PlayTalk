//TODO:Make into type and and more user types
export interface User {
  _id: string;
  username: string;
  password: string;
  avatarFileName: string;
  avatarUrl: string;
  isOnline: boolean;
  isInviting: boolean;
  activeGames: string[];
  unreadMessageCount?: number;
  isChatOpen?: boolean;
}
