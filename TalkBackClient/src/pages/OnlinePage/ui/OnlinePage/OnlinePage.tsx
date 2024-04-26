import { User } from '@/entities/User'
import { GameRequest } from '@/features/GameRequest'
import { UserList } from '@/features/UserList'
import resources from '@/shared/assets/locales/en/OnlinePageResources.json'
import { cx } from '@/shared/lib/cx'
import { UiButton, UiText } from '@/shared/ui'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useUsersStatus } from '../../api/updateUsersStatusApiService'
import { ChatModalStateProps } from '../../hooks/useInviteGameSocket'
import { useOnlinePageSockets } from '../../hooks/useOnlinePageSockets'
import { ChatModals } from '../ChatModals'
import cls from './OnlinePage.module.scss'

const OnlinePage = ({ className }: { className?: string }) => {
	const [cookies, , removeCookie] = useCookies(['jwt-cookie'])
	const token = cookies['jwt-cookie']?.token
	const currentUser = cookies['jwt-cookie']?.user

	const [chatModals, setChatModals] = useState<ChatModalStateProps[]>()

	const handleOpenChatModal = (user: User) => {
		if (chatModals && chatModals.length > 5) {
			alert(resources.chatModalQuantityError)
			return
		}
		if (chatModals?.find(({ user: currentUser }) => currentUser === user)) return

		const newChatModalProps: ChatModalStateProps = { user }

		setChatModals(prev => [...(prev || []), newChatModalProps])
	}

	const navigate = useNavigate()

	const {
		upToDateUsers,
		isInvitedToGame,
		gameInviteSenderUsername,
		updateUsers,
		handleUserInvite,
	} = useOnlinePageSockets()

	useUsersStatus(token, updateUsers, currentUser)

	const handleLogout = () => {
		removeCookie('jwt-cookie')
		navigate('/auth')
	}

	//if (isLoading) {
	//	return <Loader />
	//}

	//if (isError && error) {
	//	{
	//		isError && error ? (
	//			<UiText>{`${resources.errorMessagePrefix} ${error.message}`}</UiText>
	//		) : null
	//	}
	//}
	return (
		<div className={cx(cls.OnlinePage, {}, [className])}>
			<UiButton onClick={handleLogout}>{resources.logoutButton}</UiButton>
			<UiText size="xl">{resources.onlineUsersHeading}</UiText>
			<UserList
				users={upToDateUsers}
				handleUserChatButton={handleOpenChatModal}
				handleUserInviteButton={handleUserInvite}
			/>
			<ChatModals currentUser={currentUser} chatModals={chatModals} setChatModals={setChatModals} />
			{isInvitedToGame && <GameRequest senderUsername={gameInviteSenderUsername} />}
		</div>
	)
}

export default OnlinePage
