import { GameName } from "@/entities/game/Game";
import { GameStatus } from "@/entities/game/GameStatus";

export type User = {
  username: string;
  avatarFileName?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  gameStatusMap?: Partial<Record<GameName, GameStatus>>;
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
