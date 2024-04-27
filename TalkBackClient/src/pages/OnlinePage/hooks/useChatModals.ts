import { User } from '@/entities/User'
import { Message } from '@/features/Chat/ui/ChatMessage/ui/ChatMessage'
import { onlineSocket } from '@/shared/api/sockets'
import { useCallback, useEffect } from 'react'

export interface ChatModalStateProps {
	user: User
	position?: {
		x: number
		y: number
	}
}

export const useChatModals = (currentUser: User) => {
	const handleUserMessage = useCallback(
		(receiverUsername: string, message: Message) => {
			console.log(receiverUsername)

			onlineSocket.emit('send-message', {
				senderUsername: currentUser.username,
				receiverUsername,
				message,
			})
		},
		[currentUser.username]
	)

	return {
		handleUserMessage,
	}
}

export const useReceiveMessage = (
	receiverUsername: string,
	receiveMessage: ({
		senderUsername,
		message,
	}: {
		senderUsername: string
		message: Message
	}) => void,
	updateChatHistory: (messages: Message[], receiverUsername: string) => void
) => {
	useEffect(() => {
		onlineSocket.emit('on-chat-open', receiverUsername)
		onlineSocket.on('update-chat', updateChatHistory)
		onlineSocket.on('receive-message', receiveMessage)

		return () => {
			onlineSocket.off('update-chat', updateChatHistory)
			onlineSocket.off('receive-message', receiveMessage)
		}
	}, [receiveMessage, receiverUsername, updateChatHistory])
}
