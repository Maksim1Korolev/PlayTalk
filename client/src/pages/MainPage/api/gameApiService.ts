import axios from "axios";

export const $gameApi = axios.create({
  baseURL: import.meta.env.VITE_GAME_SOCKET_URL,
});

export const gameApiService = {
  getActiveGames: async (token: string, username: string) => {
    const response = await $gameApi.get(`/api/game/games/${username}`, {
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
    const response = await $gameApi.get(`/api/game/${gameName}`, {
      params: { player1Username, player2Username },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.game;
  },
};
