import { cx } from '@/shared/lib/cx'
import { ReactNode, memo } from 'react'

import { VStack } from '@/shared/ui'
import cls from './MessageDirection.module.scss'

export const MessageDirection = memo(
	({
		className,
		isRight,
		children,
	}: {
		className?: string
		isRight?: boolean
		children: ReactNode
	}) => {
		return (
			<VStack
				align={isRight ? 'end' : 'start'}
				className={cx(cls.MessageDirection, {}, [className])}
				max
			>
				{children}
			</VStack>
		)
	}
)
