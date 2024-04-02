import { memo, useEffect, useState } from 'react'

import { User } from '@/entities/User'
import { Chat } from '@/features/Chat'
import { MessageHistory } from '@/features/Chat/ui/Chat'
import { cx } from '@/shared/lib/cx'
import cls from './ChatModal.module.scss'

export const ChatModal = memo(
	({
		className,
		receiverUser,
		receiveMessageSubscribe,
		handleUserSend,
	}: {
		className?: string

		receiverUser: User
		receiveMessageSubscribe: (senderUsername: string, callback: (message: string) => void) => void
		handleUserSend: (receiverUsername: string, message: string) => void
	}) => {
		const [messageHistory, setMessageHistory] = useState<MessageHistory[]>()
		// Assume useOnlineSocket hook has been updated to include necessary information

		useEffect(() => {
			// Setup subscription when the component mounts
			const unsubscribe = receiveMessageSubscribe(receiverUser.username, (message: string) => {
				// Assuming message format needs to be adjusted or used directly
				AddMessageToHistory(receiverUser.username, message)
			})

			// Cleanup subscription when the component unmounts
			return unsubscribe
		}, [receiverUser.username])

		const AddMessageToHistory = (username: string, message: string) => {
			const newMessage: MessageHistory = {
				message: message,
				date: new Date(),
				username: username,
			}
			setMessageHistory(prev => [...(prev || []), newMessage])
		}

		const onUserSend = (message: string) => {
			handleUserSend(receiverUser.username, message)
		}

		return (
			<div className={cx(cls.ChatModal, {}, [className])}>
				<Chat messageHistory={messageHistory} handleSendMessage={onUserSend} />
			</div>
		)
	}
)
