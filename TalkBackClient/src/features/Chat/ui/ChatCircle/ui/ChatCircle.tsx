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
		const avatarSrc = `${import.meta.env.VITE_AUTH_SERVER_STATIC_URL}${imageSrc}`
		return (
			<div onClick={onClick} className={`${cls.ChatCircle} ${className}`}>
				<div className={cls.chatOverlay}>
					<AppImage
						className={cls.profileImage}
						width={80}
						height={80}
						src={avatarSrc}
						draggable="false"
					/>
				</div>
			</div>
		)
	}
)
