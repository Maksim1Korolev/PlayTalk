import { Game, GameData } from "@/entities/game/Game";

import { $gameApi } from "./api";

export interface ActiveGames {
  [username: string]: string[];
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
    console.log(response.data.game);
    console.log(response.data.game);

    return response.data.game;
  },
};
