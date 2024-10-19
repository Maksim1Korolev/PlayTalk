export type User = {
  _id: string;
  username: string;
  avatarFileName?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  isInviting?: boolean;
  activeGames?: string[];
  unreadMessageCount?: number;
  isChatOpen?: boolean;
};

export interface UserState {
  users: User[];
  currentUser: CurrentUser | null;
}

export type CurrentUser = User | undefined | null;
