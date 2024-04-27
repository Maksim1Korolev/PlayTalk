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

	useEffect(() => {
		const onConnect = () => {
			gameSocket.emit('online-ping', user.username)
		}

		const updateUsersGameStatus = (usernames: string[]) => {
			setInGameUsernames(usernames)
			if (!upToDateUsers) setUsersGameStatus(usernames)
		}

		const updatePlayingUsersStatus = (username1: string, username2: string, areInGame: boolean) => {
			setInGameUsernames(prev => {
				if (areInGame) {
					return [...new Set([...prev, username1, username2])]
				} else {
					return prev.filter(u => u !== username1 && u !== username2)
				}
			})

			setUpToDateUsers(prevUsers => {
				if (!prevUsers) return []

				return prevUsers.map(user => {
					if (user.username === username1 || user.username === username2) {
						return { ...user, inGame: areInGame }
					}
					return user
				})
			})
		}

		/////////////////////////////////////////////////////
		gameSocket.on('connect', onConnect)
		gameSocket.on('in-game-players', updateUsersGameStatus)
		gameSocket.on('players-started-game', updatePlayingUsersStatus)
		/////////////////////////////////////////////////////

		return () => {
			gameSocket.close()
		}
	}, [])

	const handleUserInvite = (receiverUsername: string) => {
		gameSocket.emit('invite-to-play', {
			senderUsername: user.username,
			receiverUsername,
		})
	}

	return {
		setUsersGameStatus,
		handleUserInvite,
		inGameUsernames,
	}
}

export const useReceiveInvite = (
	receiveInvite: ({ senderUsername }: { senderUsername: string }) => void
) => {
	useEffect(() => {
		gameSocket.on('receive-game-invite', receiveInvite)
		return () => {
			gameSocket.off('receive-game-invite')
		}
	}, [receiveInvite])
}
