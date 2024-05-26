import { Mods, cx } from "@/shared/lib/cx";
import cls from "./UiButton.module.scss";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "outlined" | "clear" | "filled";
type ButtonColor = "default" | "success" | "blue";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  ...otherProps
}: ButtonProps) => {
  const buttonMods: Mods = {
    [cls.textIsUnderlined]: textIsUnderlined,
    [cls.max]: max,
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
