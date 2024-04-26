import { User } from '@/entities/User'
import { useCallback, useState } from 'react'
import { useInviteGameSocket, useReceiveInvite } from './useInviteGameSocket'
import { useOnlineSocket } from './useOnlineSocket'

export const useOnlinePageSockets = () => {
	const [isInvitedToGame, setIsInvitedToGame] = useState(false)
	const [upToDateUsers, setUpToDateUsers] = useState<User[]>()
	const [gameInviteSenderUsername, setGameInviteSenderUsername] = useState('')
	useState<User[]>()

	const updateUsers = (users: User[]) => {
		setUpToDateUsers(users)
	}

	const { onlineUsernames } = useOnlineSocket({
		upToDateUsers,
		setUpToDateUsers,
	})

	const { handleUserInvite } = useInviteGameSocket({
		upToDateUsers,
		setUpToDateUsers,
	})

	const receiveInviteSubscribe = useCallback(({ senderUsername }: { senderUsername: string }) => {
		console.log(senderUsername)
		setGameInviteSenderUsername(senderUsername)
		setIsInvitedToGame(true)
	}, [])

	useReceiveInvite(receiveInviteSubscribe)

	return {
		upToDateUsers,
		isInvitedToGame,
		gameInviteSenderUsername,
		updateUsers,
		handleUserInvite,
	}
}
