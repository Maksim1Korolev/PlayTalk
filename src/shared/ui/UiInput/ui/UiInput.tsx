import { ChangeEvent, InputHTMLAttributes } from "react";
import cls from "./UiInput.module.scss";
import { UiText, VStack } from "../..";

type HTMLInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "readOnly" | "size" | "max"
>;
interface InputProps extends HTMLInputProps {
  className?: string;
  value?: string | number;
  placeholder?: string;
  label?: string;
  max?: boolean;
  onChange?: (value: string) => void;
}
export const UiInput = ({
  className,
  value,
  placeholder,
  label,
  max,
  onChange,
  ...otherProps
}: InputProps) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <VStack align="start" gap="8" max={max}>
      {label && <UiText>{label}</UiText>}
      <input
        value={value}
        className={`${cls.Input} ${className}`}
        placeholder={placeholder}
        onChange={onChangeHandler}
        {...otherProps}
      />
    </VStack>
  );
};
