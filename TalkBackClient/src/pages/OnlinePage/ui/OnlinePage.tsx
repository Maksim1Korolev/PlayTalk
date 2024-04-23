import { User } from '@/entities/User'
import { UserList } from '@/features/UserList'
import resources from '@/shared/assets/locales/en/OnlinePageResources.json'
import { Loader, UiButton, UiText } from '@/shared/ui'
import { ChatModal } from '@/widgets/ChatModal'
import { useCookies } from 'react-cookie'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../api/apiUsersService'
import { useInviteGameSocket } from '../hooks/useGameSocket'
import { ChatModalStateProps, useOnlineSocket } from '../hooks/useOnlineSocket'
import cls from './OnlinePage.module.scss'

const OnlinePage = ({ className }: { className?: string }) => {
	const [cookies, , removeCookie] = useCookies(['jwt-cookie'])
	const token = cookies['jwt-cookie']?.token
	const currentUser = cookies['jwt-cookie']?.user
	const navigate = useNavigate()

	const { data, isLoading, isError, error } = useQuery<User[], Error>(
		'users',
		() => apiService.getUsers(token),
		{
			enabled: !!token,
			onSuccess: fetchedUsers => {
				const otherUsers = fetchedUsers.filter(user => user._id !== currentUser._id)

				updateUsersStatus(otherUsers)
			},
		}
	)

	const updateUsersStatus = (users: User[]) => {
		const usersWithOnlineStatus = setUsersOnline(onlineUsernames, users)

		setUsersGameStatus(inGameUsernames, usersWithOnlineStatus)
	}

	const {
		onlineUsernames,
		usersWithOnlineStatus,
		chatModals,
		setChatModals,
		setUsersOnline,
		handleUserMessage,
	} = useOnlineSocket({
		data,
	})
	//remove usersWithOnlineStatus?

	const { inGameUsernames, usersWithGameStatus, setUsersGameStatus, handleUserInvite } =
		useInviteGameSocket({
			data: usersWithOnlineStatus,
		})

	const handleLogout = () => {
		removeCookie('jwt-cookie')
		navigate('/auth')
	}

	if (isLoading) {
		return <Loader />
	}

	if (isError && error) {
		{
			isError && error ? (
				<UiText>{`${resources.errorMessagePrefix} ${error.message}`}</UiText>
			) : null
		}
	}

	const handleOpenNewChat = (user: User) => {
		if (chatModals && chatModals.length >= 5) {
			alert(resources.chatModalQuantityError)
			return
		}
		if (chatModals?.find(({ user: currentUser }) => currentUser === user)) return

		const newChatModalProps: ChatModalStateProps = { user }

		setChatModals(prev => [...(prev || []), newChatModalProps])
	}

	const handleCloseChat = (userId: string) => {
		setChatModals(prev => prev?.filter(modal => modal.user._id !== userId))
	}

	return (
		<div className={`${cls.OnlinePage} ${className || ''}`}>
			<UiButton onClick={handleLogout}>{resources.logoutButton}</UiButton>
			<UiText size="xl">{resources.onlineUsersHeading}</UiText>
			<UserList handleUserChatButton={handleOpenNewChat} users={usersWithGameStatus} />
			{chatModals?.map(({ user }, index) => {
				return (
					<ChatModal
						key={`${user._id} ${index}`}
						currentUsername={currentUser.username}
						receiverUser={user}
						handleSendMessage={handleUserMessage}
						handleCloseModal={handleCloseChat}
					/>
				)
			})}
		</div>
	)
}

export default OnlinePage
