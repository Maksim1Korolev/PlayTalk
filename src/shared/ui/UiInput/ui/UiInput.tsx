import { ChangeEvent, InputHTMLAttributes, ReactNode, useState } from "react";
import cls from "./UiInput.module.scss";

type HTMLInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "readOnly" | "size"
>;
interface InputProps extends HTMLInputProps {
  className?: string;
  value?: string | number;
  placeholder?: string;
  onChange?: (value: string) => void;
}
export const UiInput = ({
  className,
  value,
  placeholder,
  onChange,
  ...otherProps
}: InputProps) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };
  return (
    <input
      value={value}
      className={`${cls.Input} ${className}`}
      placeholder={placeholder}
      onChange={onChangeHandler}
      {...otherProps}
    />
  );
};
