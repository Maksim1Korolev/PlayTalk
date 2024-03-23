import { memo } from 'react'
import cls from './<FTName>.module.scss'

export const <FTName> = ({ className }: {className?: string}) => {
		
	return (
		<div className={`${cls.<FTName>} ${className}`}>

		</div>
	)
}