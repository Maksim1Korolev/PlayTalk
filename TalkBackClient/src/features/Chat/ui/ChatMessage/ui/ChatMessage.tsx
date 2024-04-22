import { cx } from '@/shared/lib/cx'
import { memo } from 'react'

import cls from './ChatMessage.module.scss'

export interface Message {
	message: string
	date: Date
	username: string
}

export const ChatMessage = memo(
	({
		className,
		isRight,
		message,
	}: {
		className?: string
		isRight?: boolean
		message: Message
	}) => {
		return (
			//Message Direction
			//<VStack align={isRight ? 'end' : 'start'} className={cx(cls.messageDirection, {}, [])} max>
			<div className={cx(cls.chatMsg, { [cls.self]: isRight, [cls.user]: !isRight }, [className])}>
				<span className={cls.msgAvatar}>
					{/*<AppImage src="https://image.crisp.im/avatar/operator/196af8cc-f6ad-4ef7-afd1-c45d5231387c/240/?1483361727745" />*/}
				</span>
				<div className={cls.cmMsgText}>{message.message}</div>
			</div>

			//	<Card padding="8" className={cx(cls.ChatMessage, {}, [className])}>
			//		<UiText>{message.message}</UiText>
			//	</Card>
			//</VStack>
		)
	}
)
