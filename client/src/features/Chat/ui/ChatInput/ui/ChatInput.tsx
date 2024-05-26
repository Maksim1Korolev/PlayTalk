import { cx } from '@/shared/lib/cx'

import cls from './ChatInput.module.scss'

//maybe TextArea or something
export const ChatInput = ({
	className,
	text,
	onChange,
	placeholder,
}: {
	className?: string
	text: string
	placeholder?: string
	onChange: (text: string) => void
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e.target.value)
	}

	return (
		<textarea
			className={cx(cls.textarea, {}, [className])}
			value={text}
			onChange={handleChange}
			placeholder={placeholder}
		/>
	)
}
