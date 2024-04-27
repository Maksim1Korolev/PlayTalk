import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { User } from '@/entities/User'
import { Chat } from '@/features/Chat'

import { ChatCircle } from '@/features/Chat/ui/ChatCircle'
import { Message } from '@/features/Chat/ui/ChatMessage/ui/ChatMessage'
import { useReceiveMessage } from '@/pages/OnlinePage/hooks/useChatModals'
import { cx } from '@/shared/lib/cx'
import { Rnd } from 'react-rnd'
import cls from './ChatModal.module.scss'

export const ChatModal = memo(
	({
		className,
		currentUsername,
		receiverUser,
		position,
		handleCloseModal,
		handleSendMessage,
	}: {
		className?: string
		currentUsername: string
		receiverUser: User
		position?: { x: number; y: number }
		handleCloseModal: (userId: string) => void
		handleSendMessage: (receiverUsername: string, message: Message) => void
	}) => {
		const messageEndRef = useRef<HTMLDivElement>(null)
		const [messageHistory, setMessageHistory] = useState<Message[]>()
		const [isDragged, setIsDragged] = useState(false)

		const [startPos, setStartPos] = useState({ x: 0, y: 0 })
		const [isOpen, setIsOpen] = useState(false)

		useEffect(() => {
			if (isOpen && messageEndRef.current) {
				messageEndRef.current.scrollTop = 0
			}
		}, [isOpen])

		// Scroll to the bottom to show the latest messages
		useEffect(() => {
			if (isOpen && messageEndRef.current) {
				const scrollHeight = messageEndRef.current.scrollHeight
				const height = messageEndRef.current.clientHeight
				messageEndRef.current.scrollTop = scrollHeight - height
			}
		}, [isOpen, messageHistory?.length])

		const handleDragStart = (event, data) => {
			setStartPos({ x: data.x, y: data.y })
			setIsDragged(false)
		}

		const handleDragStop = (event, data) => {
			const distance = Math.sqrt(
				Math.pow(data.x - startPos.x, 2) + Math.pow(data.y - startPos.y, 2)
			)
			if (distance > 10) {
				setIsDragged(true)
			}
		}

		const handleOpenChatModal = () => {
			if (!isDragged) {
				setIsOpen(true)
				messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
			}
		}

		const handleCloseChatModal = () => {
			if (!isDragged) {
				setIsOpen(false)
			}
		}
		const AddMessageToHistory = useCallback((message: Message) => {
			setMessageHistory(prev => [...(prev || []), message])
			messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
		}, [])

		const AddMessagesToHistory = useCallback((messages: Message[]) => {
			setMessageHistory(prev => [...(prev || []), ...messages])
			messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
		}, [])

		const receiveMessageSubscribe = useCallback(
			({ senderUsername, message }: { senderUsername: string; message: Message }) => {
				if (senderUsername === receiverUser.username) {
					AddMessageToHistory(message)
				}
			},
			[AddMessageToHistory, receiverUser.username]
		)

		const updateChatHistory = useCallback(
			(messages: Message[], receiverUsername: string) => {
				console.log(messages)

				if (receiverUsername === receiverUser.username) {
					AddMessagesToHistory(messages)
				}
			},
			[AddMessagesToHistory, receiverUser.username]
		)

		useReceiveMessage(receiverUser.username, receiveMessageSubscribe, updateChatHistory)

		const onUserSend = useCallback(
			(message: string) => {
				const wrapMessage = (message: string): Message => {
					return {
						message: message,
						date: new Date(),
						username: currentUsername,
					}
				}

				const newMessage = wrapMessage(message)
				handleSendMessage(receiverUser.username, newMessage)
				AddMessageToHistory(newMessage)
			},
			[AddMessageToHistory, currentUsername, handleSendMessage, receiverUser.username]
		)
		if (!isOpen)
			return (
				<Rnd
					onDragStart={handleDragStart}
					onDragStop={handleDragStop}
					minWidth={80}
					default={{
						x: position?.x || 0,
						y: position?.y || 0,
						width: 80,
						height: 80,
					}}
					minHeight={80}
					bounds="window"
					enableResizing={false}
				>
					<ChatCircle
						className={cx(cls.ChatModal, {}, [className])}
						onClick={handleOpenChatModal}
					/>
				</Rnd>
			)

		return (
			<Rnd
				onDragStart={handleDragStart}
				onDragStop={handleDragStop}
				default={{
					x: -50,
					y: -50,
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
					messagesEndRef={messageEndRef}
					onClose={() => handleCloseModal(receiverUser._id)}
					onCollapse={handleCloseChatModal}
				/>
			</Rnd>
		)
	}
)
