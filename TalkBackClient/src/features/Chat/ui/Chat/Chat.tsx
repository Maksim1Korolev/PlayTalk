import { cx } from '@/shared/lib/cx'
import { Card, HStack, UiButton, UiText, VStack } from '@/shared/ui'
import CancelIcon from '@mui/icons-material/Cancel'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn'
import SendIcon from '@mui/icons-material/Send'
import { memo, useState } from 'react'
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
		handleSendMessage,
		onClose,
		onCollapse,
	}: {
		className?: string
		messageHistory?: Message[]
		currentUsername?: string
		receiverUsername?: string
		handleSendMessage: (message: string) => void
		onClose: () => void
		onCollapse: () => void
	}) => {
		const [inputMessage, setInputMessage] = useState<string>('')

		const handleSendButton = () => {
			handleSendMessage(inputMessage)
			setInputMessage('')
		}

		return (
			<VStack className={cx(cls.Chat, {}, [className])} justify="start" max>
				<HStack className={cls.chatBoxHeader} max>
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
					<div className={cls.chatLogs}>
						{messageHistory?.map((message, index) => (
							<ChatMessage
								message={message}
								key={`${index} ${message.date}`}
								isRight={currentUsername == message.username}
							/>
						))}
					</div>
				</Card>
				<div className={cls.chatInput}>
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
