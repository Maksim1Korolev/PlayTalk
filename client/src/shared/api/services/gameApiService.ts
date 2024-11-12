import { Game, GameData, GameName } from "@/entities/game/Game";

import { $gameApi } from "./api";

export interface ActiveGames {
  [username: string]: GameName[];
}

export const gameApiService = {
  getActiveGames: async (token: string): Promise<ActiveGames> => {
    const response = await $gameApi.get<{
      activeGames: ActiveGames;
    }>(`/game/games`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.activeGames;
  },

  getGame: async (
    token: string,
    { gameName, opponentUsername }: GameData
  ): Promise<Game> => {
    const response = await $gameApi.get<{
      game: Game;
    }>(`/game/${gameName}`, {
      params: { opponentUsername },
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.game;
  },
};
