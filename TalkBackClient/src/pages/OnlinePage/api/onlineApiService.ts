import axios from 'axios'

export const $onlineApi = axios.create({
	baseURL: import.meta.env.VITE_ONLINE_SOCKET_URL,
})

export const onlineApiService = {
	getOnlineUsernames: async (token: string) => {
		const response = await $onlineApi.get(`/api/online/onlineUsernames`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		return response.data.onlineUsernames
	},
}
