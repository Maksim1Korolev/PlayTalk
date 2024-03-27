import { memo } from 'react'
import { addResponseMessage } from 'react-chat-widget'
import { User } from '../../../entities/User'
import { Chat } from '../../../features/Chat'
import { cx } from '../../../shared/lib/cx'
import { useChatSocket } from '../hooks/useChatSocket'
import cls from './ChatModal.module.scss'

export const ChatModal = memo(
	({
		className,
		currentUser,
		receiverUser,
	}: {
		className?: string
		currentUser: User
		receiverUser: User
	}) => {
		const printMessage = (message: string) => {
			addResponseMessage(message)
		}

		const { handleUserMessage } = useChatSocket({
			currentUsername: currentUser.username,
			receiverUsername: receiverUser.username,
			printMessage,
		})

		return (
			<div className={cx(cls.ChatModal, {}, [className])}>
				<Chat
					currentUsername={currentUser.username}
					receiverUsername={receiverUser.username}
					onMessageReceived={printMessage}
					handleSendMessage={handleUserMessage}
				/>
			</div>
		)
	}
)
