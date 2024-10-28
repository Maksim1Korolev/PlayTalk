import { cx } from "@/shared/lib"
import { memo } from 'react'
import cls from './StarsBackground.module.scss'

export const StarsBackground = memo(({ className }: {className?: string}) => {
		
	return (
    <div className={cx(cls.starsWrapper,{},[className])}>
      <div className={cls.stars}></div>
      <div className={cls.stars2}></div>
      <div className={cls.stars3}></div>
    </div>
  );
});