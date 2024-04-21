import { memo } from 'react'
import cls from './GameWidget.module.scss'

export const GameWidget = ({ className }: {className?: string}) => {
		
	return (
		<div className={`${cls.GameWidget} ${className}`}>

		</div>
	)
}