import { Card, HStack, UiButton, UiText } from '../../../../../shared/ui'
import { User } from '../../../model/user'
import { UserOnlineIndicator } from '../../UserOnlineIndicator'
import cls from './UserCard.module.scss'

export const UserCard = ({
	className,
	user,
	handleUserChatButton,
	handlePlayButton,
}: {
	className?: string
	user: User
	handleUserChatButton: (user: User) => void
	handlePlayButton: () => void
}) => {
	const handleChatButton = () => {
		handleUserChatButton(user)
	}
	return (
		<Card className={`${cls.UserCard} ${className}`}>
			<HStack>
				<UiText>{user.username}</UiText>
				<UiButton onClick={handleChatButton}>Chat</UiButton>
				<UiButton onClick={handlePlayButton}>Play</UiButton>
				<UserOnlineIndicator isOnline={user.isOnline} />
			</HStack>
		</Card>
	)
}
