import { $gameApi } from "@/shared/api/api";

export const gameApiService = {
  getActiveGames: async (token: string, username: string) => {
    const response = await $gameApi.get(`/game/games/${username}`, {
      params: { username },
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.activeGames;
  },

  getGame: async (
    token: string,
    {
      gameName,
      player1Username,
      player2Username,
    }: {
      gameName: string;
      player1Username: string;
      player2Username: string;
    }
  ) => {
    const response = await $gameApi.get(`/game/${gameName}`, {
      params: { player1Username, player2Username },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.game;
  },
};
