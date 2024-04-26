import axios from 'axios'

export const $gameApi = axios.create({
	baseURL: import.meta.env.VITE_GAME_SOCKET_URL,
})

export const gameConnectionApiService = {
	getInGameUsernames: async (token: string) => {
		const response = await $gameApi.get(`/api/connection/inGameUsernames`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		return response.data.inGameUsernames
	},
}
