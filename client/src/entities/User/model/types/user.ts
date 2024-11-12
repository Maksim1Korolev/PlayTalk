import { GameName } from "@/entities/game/Game";

//TODO:Move
export type GameStatus = {
  hasInvitation?: boolean;
  isActive?: boolean;
};

export type User = {
  username: string;
  avatarFileName?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  activeGames?: string[];
  gameStatusMap?: Record<GameName, GameStatus>;
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
