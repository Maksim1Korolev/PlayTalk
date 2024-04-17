import { cx } from '@/shared/lib/cx'
import { memo } from 'react'

import { Card, UiText, VStack } from '@/shared/ui'
import cls from './ChatMessage.module.scss'

export interface Message {
	message: string
	date: Date
	username: string
}

export const ChatMessage = memo(
	({ className, message }: { className?: string; message: Message }) => {
		return (
			<Card padding="8" className={cx(cls.ChatMessage, {}, [className])}>
				<VStack>
					<UiText>{message.message}</UiText>
				</VStack>
			</Card>
		)
	}
)
