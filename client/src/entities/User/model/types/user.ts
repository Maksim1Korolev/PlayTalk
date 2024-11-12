export type User = {
  username: string;
  avatarFileName?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  isInviting?: boolean;
  activeGames?: string[];
  unreadMessageCount?: number;
};

export interface UserState {
  users: Record<string, User>;
  currentUser: CurrentUser | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export type CurrentUser = User | undefined | null;
