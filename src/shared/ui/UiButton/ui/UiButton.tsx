import cls from "./UiButton.module.scss";
import { ChangeEvent, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}
export const UiButton = ({ className, ...otherProps }: ButtonProps) => {
  return <button className={`${cls.Input} ${className}`} {...otherProps} />;
};
