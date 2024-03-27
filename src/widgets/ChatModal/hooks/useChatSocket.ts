import { useEffect } from 'react'
import { chatSocket } from '../../../shared/api/sockets'

export const useChatSocket = ({
	currentUsername,
	receiverUsername,
	printMessage,
}: {
	currentUsername: string
	receiverUsername: string
	printMessage: (message: string) => void
}): {
	handleUserMessage: (message: string) => void
} => {
	useEffect(() => {
		chatSocket.emit('join-chat', currentUsername, receiverUsername)
		chatSocket.on(`receive-message-${currentUsername}`, onMessageReceived)
	}, [])
	const handleUserMessage = (message: string) => {
		chatSocket.emit(`send-message-${receiverUsername}`, currentUsername, receiverUsername, message)
	}

	const onMessageReceived = (message: string) => {
		printMessage(message)
	}

	return {
		handleUserMessage,
	}
}
