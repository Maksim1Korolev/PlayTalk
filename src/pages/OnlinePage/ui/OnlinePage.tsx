import { memo } from 'react'
import cls from './OnlinePage.module.scss'

export const OnlinePage = ({ className }: {className?: string}) => {
		
	return (
		<div className={`${cls.OnlinePage} ${className}}>

		</div>
	)
}