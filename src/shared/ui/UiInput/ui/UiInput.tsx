import { ChangeEvent, InputHTMLAttributes } from "react";
import cls from "./UiInput.module.scss";
import { UiText, VStack } from "../..";

type HTMLInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "readOnly" | "size"
>;
interface InputProps extends HTMLInputProps {
  className?: string;
  value?: string | number;
  placeholder?: string;
  label?: string;
  onChange?: (value: string) => void;
}
export const UiInput = ({
  className,
  value,
  placeholder,
  label,
  onChange,
  ...otherProps
}: InputProps) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <VStack align="start" gap="8">
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
