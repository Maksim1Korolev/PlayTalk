import { memo } from 'react'
import cls from './<FTName>.module.scss'
import { cx } from "@/shared/lib";

export const <FTName> = memo(({ className }: {className?: string}) => {
		
	return (
		<div className={cx(cls.<FTName>, {}, [className])}>

		</div>
	)
});