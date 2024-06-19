import { Mods, cx } from "@/shared/lib/cx";
import { ButtonHTMLAttributes } from "react";
import cls from "./UiButton.module.scss";

type ButtonVariant = "outlined" | "clear" | "filled";
type ButtonColor = "default" | "success" | "blue";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  textIsUnderlined?: boolean;
  max?: boolean;
}
export const UiButton = ({
  className,
  variant = "outlined",
  color = "default",
  textIsUnderlined,
  max = false,
  disabled,
  ...otherProps
}: ButtonProps) => {
  const buttonMods: Mods = {
    [cls.textIsUnderlined]: textIsUnderlined,
    [cls.max]: max,
    [cls.disabled]: disabled,
  };
  return (
    <button
      className={cx(cls.Button, buttonMods, [
        className,
        cls[variant],
        cls[color],
      ])}
      {...otherProps}
      disabled={disabled}
    />
  );
};
