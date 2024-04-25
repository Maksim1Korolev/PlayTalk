import { memo } from 'react'
import cls from './<FTName>.module.scss'
import { cx } from "@/shared/lib/cx";

export const <FTName> = ({ className }: {className?: string}) => {
		
	return (
		<div className={cx(cls.<FTName>, {}, [className])}>

		</div>
	)
}