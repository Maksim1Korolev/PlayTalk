import axios from "axios";

export const $gameApi = axios.create({
  baseURL: import.meta.env.VITE_GAME_SOCKET_URL,
});

export const gameApiService = {
  getActiveGames: async (username: string) => {
    const response = await $gameApi.get(`/api/game/games`, {
      params: { username },
    });
    return response.data.activeGames;
  },

  getGame: async (
    gameName: string,
    player1Username: string,
    player2Username: string
  ) => {
    const response = await $gameApi.get(`/api/${gameName}`, {
      params: { player1Username, player2Username },
    });
    return response.data.game;
  },
};
