import { AppImage } from '@/shared/ui/AppImage'
import { memo } from 'react'
import cls from './ChatCircle.module.scss'

export const ChatCircle = memo(
	({
		className,
		imageSrc,
		onClick,
	}: {
		className?: string
		imageSrc?: string
		onClick: () => void
	}) => {
		return (
			<div onClick={onClick} className={`${cls.ChatCircle} ${className}`}>
				<div className={cls.chatOverlay}></div>
				<AppImage width={80} height={80} src={imageSrc} />
			</div>
		)
	}
)
