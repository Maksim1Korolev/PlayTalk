import { User } from '@/entities/User'
import { gameConnectionApiService } from './gameConnectionApiService'
import { onlineApiService } from './onlineApiService'
import { usersApiService } from './usersApiService'

export const updateUsersStatus = async (token: string) => {
	try {
		const users = await usersApiService.getUsers(token)

		const onlineUsernames = await onlineApiService.getOnlineUsernames(token)

		const usersInGame = await gameConnectionApiService.getInGameUsernames(token)

		const onlineSet = new Set(onlineUsernames)
		const inGameSet = new Set(usersInGame)

		const updatedUsers = users.map((user: User) => ({
			...user,
			isOnline: onlineSet.has(user.username),
			inGame: inGameSet.has(user.username),
		}))

		console.log('Updated Users:', updatedUsers)
		return updatedUsers
	} catch (error) {
		console.error('Error fetching data from servers:', error)
		throw error
	}
}
