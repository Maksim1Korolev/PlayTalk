import { memo } from 'react'
import cls from './GameModal.module.scss'
import { cx } from "@/shared/lib/cx";

export const GameModal = ({ className }: {className?: string}) => {
		
	return (
		<div className={cx(cls.GameModal, {}, [className])}>

		</div>
	)
}