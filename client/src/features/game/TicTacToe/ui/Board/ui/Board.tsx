import { memo } from 'react'
import cls from './Board.module.scss'
import { cx } from "@/shared/lib/cx";

export const Board = ({ className }: {className?: string}) => {
		
	return (
		<div className={cx(cls.Board, {}, [className])}>

		</div>
	)
}