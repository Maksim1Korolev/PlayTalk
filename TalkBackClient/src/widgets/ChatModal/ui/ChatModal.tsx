import { memo, useCallback, useEffect, useState } from 'react'

import { User } from '@/entities/User'
import { Chat } from '@/features/Chat'

import { ChatCircle } from '@/features/Chat/ui/ChatCircle'
import { Message } from '@/features/Chat/ui/ChatMessage/ui/ChatMessage'
import { useReceiveMessage } from '@/pages/OnlinePage/hooks/useOnlineSocket'
import { cx } from '@/shared/lib/cx'
import { Rnd } from 'react-rnd'
import cls from './ChatModal.module.scss'

export const ChatModal = memo(
	({
		className,
		currentUsername,
		receiverUser,
		handleCloseModal,
		handleSendMessage,
	}: {
		className?: string
		currentUsername: string
		receiverUser: User
		handleCloseModal: (userId: string) => void
		handleSendMessage: (receiverUsername: string, message: string) => void
	}) => {
		const [messageHistory, setMessageHistory] = useState<Message[]>()

		const [chatOpen, setChatOpen] = useState<boolean>(false)

		const receiveMessageSubscribe = useCallback(
			({ senderUsername, message }: { senderUsername: string; message: string }) => {
				console.log(senderUsername)

				if (senderUsername === receiverUser.username) AddMessageToHistory(senderUsername, message)
			},
			[]
		)
		useEffect(() => {
			const disconnect = useReceiveMessage(receiveMessageSubscribe)
			return () => {
				disconnect()
			}
		})

		const AddMessageToHistory = (username: string, message: string) => {
			const newMessage: Message = {
				message: message,
				date: new Date(),
				username: username,
			}
			setMessageHistory(prev => [...(prev || []), newMessage])
		}

		const handleOpenChatModal = () => {
			setChatOpen(true)
		}

		const handleCloseChatModal = () => {
			setChatOpen(false)
		}

		const onUserSend = (message: string) => {
			handleSendMessage(receiverUser.username, message)
			AddMessageToHistory(currentUsername, message)
		}
		if (!chatOpen)
			return (
				<Rnd minWidth={80} minHeight={80} bounds="window" enableResizing={false}>
					<ChatCircle
						className={cx(cls.ChatModal, {}, [className])}
						onClick={handleOpenChatModal}
					/>
				</Rnd>
			)

		return (
			<Rnd
				default={{
					x: 150,
					y: 205,
					width: 365,
					height: 280,
				}}
				minWidth={365}
				minHeight={280}
				bounds="window"
			>
				<Chat
					className={cx(cls.ChatModal, {}, [className])}
					handleSendMessage={onUserSend}
					currentUsername={currentUsername}
					messageHistory={messageHistory}
					receiverUsername={receiverUser.username}
					onClose={() => handleCloseModal(receiverUser._id)}
					onCollapse={handleCloseChatModal}
				/>
			</Rnd>
		)
	}
)
