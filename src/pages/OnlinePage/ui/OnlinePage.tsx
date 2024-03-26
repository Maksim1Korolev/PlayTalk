import { memo, useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useQuery } from 'react-query'
import { User } from '../../../entities/User'
import { socket } from '../../../entities/User/api/socket'
import { ChatModal } from '../../../features/ChatModal'
import { UserList } from '../../../features/UserList'
import { Loader } from '../../../shared/ui'
import { apiService } from '../api/apiUsersService'
import cls from './OnlinePage.module.scss'

interface ChatModalStateProps {
	user: User
}

export const OnlinePage = memo(({ className }: { className?: string }) => {
	const [cookies] = useCookies(['jwt-cookie'])
	const token = cookies['jwt-cookie']?.token
	const username = cookies['jwt-cookie']?.user?.username

	const [onlineUsernames, setOnlineUsernames] = useState<string[]>([])
	const [isConnected, setIsConnected] = useState(socket.connected)

	const [chatModals, setChatModals] = useState<ChatModalStateProps[]>()

	const [users, setUsers] = useState<User[]>()

	const { data, isLoading, isError, error } = useQuery<User[], Error>(
		'users',
		() => apiService.getUsers(token),
		{
			enabled: !!token,
			onSuccess: fetchedUsers => {
				setUsersOnline(onlineUsernames, fetchedUsers)
			},
		}
	)

	useEffect(() => {
		const onConnect = () => {
			setIsConnected(true)
			socket.emit('online-ping', username)
		}

		const onDisconnect = () => {
			setIsConnected(false)
			socket.emit('disconnect-ping', username)
		}

		const updateOnlineUsers = (usernames: string[]) => {
			console.log(usernames)
			console.log('usernames 123')

			setOnlineUsernames(usernames)
			if (!isLoading) setUsersOnline(usernames, data)
			console.log(usernames + ' - usernames')
			console.log(data + ' - updateOnlineUsers data')
		}

		const updateUserOnline = (username: string, isOnline: boolean) => {
			console.log(username + ' - updateUserOnline username')
			console.log(users + ' - updateUserOnline users')
			setOnlineUsernames(prev => {
				if (isOnline) {
					return prev.includes(username) ? prev : [...prev, username]
				} else {
					return prev.filter(u => u !== username)
				}
			})
			setUsers(prevUsers => {
				if (!prevUsers) return []
				console.log('prev users before')
				console.log(prevUsers)

				return prevUsers?.map(user => {
					if (user.username == username) {
						return { ...user, isOnline }
					}
					return user
				})
			})
		}

		socket.on('connect', onConnect)
		socket.on('disconnect', onDisconnect)
		socket.on('online-users', updateOnlineUsers)
		socket.on('user-connection', updateUserOnline)

		return () => {
			socket.close()
		}
	}, [])

	const setUsersOnline = useCallback(
		(usernames: string[], fetchedUsers?: User[]) => {
			const usersToUpdate = fetchedUsers || users
			if (!usersToUpdate) return
			console.log(usernames)
			console.log(onlineUsernames)
			console.log('- usernames SetUsersOnline')

			const updatedUsers = usersToUpdate.map(user => ({
				...user,
				isOnline: usernames.includes(user.username),
			}))

			setUsers(updatedUsers)
		},
		[onlineUsernames, users]
	)

	if (isLoading) {
		return <Loader />
	}

	if (isError && error) {
		return <div>Error: {error.message}</div>
	}
	const handleOpenNewChat = (user: User) => {
		const newChatModalProps: ChatModalStateProps = { user }

		setChatModals(prev => [...(prev || []), newChatModalProps])
	}

	return (
		<div className={`${cls.OnlinePage} ${className || ''}`}>
			<h2>Online Users</h2>
			<UserList handleUserChatButton={handleOpenNewChat} users={users} />
			{chatModals?.map(({ user }) => {
				const handleUserMessage = () => {}
				return <ChatModal handleUserMessage={handleUserMessage} user={user} />
			})}
		</div>
	)
})
