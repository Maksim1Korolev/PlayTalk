import { User } from '@/entities/User'
import { gameSocket } from '@/shared/api/sockets'
import { useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

export const useInviteGameSocket = ({
	upToDateUsers,
	setUpToDateUsers,
}: {
	upToDateUsers?: User[]
	setUpToDateUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>
}) => {
	const [inGameUsernames, setInGameUsernames] = useState<string[]>([])
	const [cookies] = useCookies()
	const { user }: { user: User } = cookies['jwt-cookie']

	const setUsersGameStatus = useCallback(
		(usernames: string[]) => {
			const usersToUpdate = upToDateUsers
			if (!usersToUpdate) return

			const updatedUsers = usersToUpdate.map((user: User) => ({
				...user,
				inGame: usernames.includes(user.username),
			}))

			setUpToDateUsers(updatedUsers)
			return { updatedUsers }
		},
		[setUpToDateUsers, upToDateUsers]
	)

	const updateUsersGameStatus = (usernames: string[]) => {
		setInGameUsernames(usernames)
		setUpToDateUsers(prev =>
			prev?.map((user: User) => ({
				...user,
				inGame: usernames.includes(user.username),
			}))
		)
		if (!upToDateUsers) setUsersGameStatus(usernames)
	}

	const handleBackgammonConnection = ({
		senderUsername = user.username,
		receiverUsername,
		areBusy = true,
	}: {
		senderUsername?: string
		receiverUsername: string
		areBusy?: boolean
	}) => {
		updateUsersGameStatus([senderUsername, receiverUsername])

		gameSocket.emit('backgammon-connection', {
			senderUsername,
			receiverUsername,
			areBusy,
		})
	}

	useEffect(() => {
		const onConnect = () => {
			gameSocket.emit('online-ping', user.username)
		}

		const updatePlayingUsersStatus = (
			[senderUsername, receiverUsername]: string[],
			areInGame: boolean
		) => {
			setInGameUsernames(prev => {
				if (areInGame) {
					return [...new Set([...prev, senderUsername, receiverUsername])]
				} else {
					return prev.filter(u => u !== senderUsername && u !== receiverUsername)
				}
			})

			setUpToDateUsers(prevUsers => {
				if (!prevUsers) return []

				return prevUsers.map(user => {
					if (user.username === senderUsername || user.username === receiverUsername) {
						return { ...user, inGame: areInGame }
					}
					return user
				})
			})
		}

		gameSocket.on('connect', onConnect)
		gameSocket.on('in-game-players', updateUsersGameStatus)
		gameSocket.on('update-busy-status', updatePlayingUsersStatus)

		return () => {
			gameSocket.off('connect', onConnect)
			gameSocket.off('in-game-players', updateUsersGameStatus)
			gameSocket.off('update-busy-status', updatePlayingUsersStatus)
			gameSocket.close()
		}
	}, [])

	return {
		setUsersGameStatus,
		handleBackgammonConnection,
		inGameUsernames,
	}
}

export const useReceiveInvite = (
	receiveInvite: ({ senderUsername }: { senderUsername: string }) => void
) => {
	useEffect(() => {
		gameSocket.on('receive-game-invite', receiveInvite)
		return () => {
			gameSocket.off('receive-game-invite', receiveInvite)
		}
	}, [receiveInvite])
}
