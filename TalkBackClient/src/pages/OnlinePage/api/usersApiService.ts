import axios from 'axios'

export const $usersApi = axios.create({
	baseURL: import.meta.env.VITE_USERS_SERVER_URL,
})

export const usersApiService = {
	getUsers: async (token: string) => {
		const response = await $usersApi.get(`/`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		return response.data.users
	},
}
