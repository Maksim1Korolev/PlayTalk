import { cx } from '@/shared/lib/cx'
import { Card, HStack, UiButton, UiInput, VStack } from '@/shared/ui'
import { useState } from 'react'
import { ChatMessage } from '../ChatMessage'
import { Message } from '../ChatMessage/ui/ChatMessage'
import { MessageDirection } from '../MessageDirection'
import cls from './Chat.module.scss'

export const Chat = ({
	className,
	messageHistory,
	currentUsername,
	handleSendMessage,
}: {
	className?: string
	messageHistory?: Message[]
	currentUsername?: string
	handleSendMessage: (message: string) => void
}) => {
	const [inputMessage, setInputMessage] = useState<string>('')

	const handleSendButton = () => {
		handleSendMessage(inputMessage)
		setInputMessage('')
	}

	return (
		<Card className={cx(cls.Chat, {}, [className])} padding="8">
			<VStack gap="16" max>
				<Card variant="light" max padding="24">
					<VStack className={cls.messageLog} gap="8">
						{messageHistory?.map((message, index) => (
							<MessageDirection isRight={currentUsername === message.username}>
								<ChatMessage key={index} message={message} />
							</MessageDirection>
						))}
					</VStack>
				</Card>
				<HStack gap="8" max>
					<UiInput value={inputMessage} onChange={e => setInputMessage(e)} max />
					<UiButton variant="outlined" onClick={handleSendButton}>
						Send
					</UiButton>
				</HStack>
			</VStack>
		</Card>
	)
}
