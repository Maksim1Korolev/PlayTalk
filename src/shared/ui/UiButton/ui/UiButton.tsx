import { Mods, cx } from "@/shared/lib/cx";
import cls from "./UiButton.module.scss";
import { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "outlined" | "clear" | "filled";

export type ButtonColor = "default" | "success" | "blue";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  textIsUnderlined?: boolean;
}
export const UiButton = ({
  className,
  variant = "outlined",
  color = "default",
  textIsUnderlined,
  ...otherProps
}: ButtonProps) => {
  const buttonMods: Mods = {
    [cls.textIsUnderlined]: textIsUnderlined,
  };
  return (
    <button
      className={cx(cls.Button, buttonMods, [
        className,
        cls[variant],
        cls[color],
      ])}
      {...otherProps}
    />
  );
};
