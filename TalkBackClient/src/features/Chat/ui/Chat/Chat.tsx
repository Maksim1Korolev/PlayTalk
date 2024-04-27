import { cx } from '@/shared/lib/cx'
import { Card, HStack, UiButton, UiText, VStack } from '@/shared/ui'
import CancelIcon from '@mui/icons-material/Cancel'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn'
import SendIcon from '@mui/icons-material/Send'
import { RefObject, memo, useRef, useState } from 'react'
import { ChatInput } from '../ChatInput'
import { ChatMessage } from '../ChatMessage'
import { Message } from '../ChatMessage/ui/ChatMessage'
import cls from './Chat.module.scss'

export const Chat = memo(
	({
		className,
		messageHistory,
		currentUsername,
		receiverUsername,
		messagesEndRef: externalRef,
		handleSendMessage,
		onClose,
		onCollapse,
	}: {
		className?: string
		messageHistory?: Message[]
		currentUsername?: string
		receiverUsername?: string
		messagesEndRef?: RefObject<HTMLDivElement>
		handleSendMessage: (message: string) => void
		onClose: () => void
		onCollapse: () => void
	}) => {
		const [inputMessage, setInputMessage] = useState<string>('')
		const internalRef = useRef<HTMLDivElement>(null)
		const usedRef: RefObject<HTMLDivElement> = externalRef || internalRef

		const handleSendButton = () => {
			handleSendMessage(inputMessage)
			setInputMessage('')
			scrollToBottom()
		}
		const scrollToBottom = () => {
			usedRef.current?.scrollIntoView({ behavior: 'smooth' })
		}

		const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key === 'Enter') {
				if (event.shiftKey) return
				console.log('Enter key was pressed')
				handleSendButton()
			}
		}

		return (
			<VStack className={cx(cls.Chat, {}, [className])} justify="start" max>
				<HStack className={cx(cls.chatBoxHeader, {}, ['drag-handle'])} max>
					<UiText max>{receiverUsername}</UiText>
					<HStack className={cls.controlButtons}>
						<UiButton variant="clear" onClick={onCollapse} className={cls.chatBoxToggle}>
							<DoDisturbOnIcon />
						</UiButton>
						<UiButton variant="clear" onClick={onClose} className={cls.chatBoxToggle}>
							<CancelIcon />
						</UiButton>
					</HStack>
				</HStack>

				<Card className={cx(cls.chatBoxBody)} border="default" variant="light" max>
					<div className={cls.chatBoxOverlay}></div>
					<div className={cls.chatLogs} ref={usedRef}>
						{messageHistory?.map((message, index) => (
							<ChatMessage
								message={message}
								key={`${index} ${message.date}`}
								isRight={currentUsername == message.username}
							/>
						))}
						<div />
					</div>
				</Card>
				<div className={cls.chatInput} onKeyDown={handleKeyDown}>
					<ChatInput
						className={cls.chatInput}
						text={inputMessage}
						placeholder="Type your message here..."
						onChange={e => setInputMessage(e)}
					/>

					<UiButton className={cls.chatSubmit} variant="clear" onClick={handleSendButton}>
						<SendIcon />
					</UiButton>
				</div>
			</VStack>
		)
	}
)
