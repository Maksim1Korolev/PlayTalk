import { HTMLAttributes, ReactNode, memo } from "react";
import cls from "./Card.module.scss";
import { cx } from "../../../lib/cx";

export type CardVariant = "default" | "outlined" | "light";
export type CardBorder = "default" | "round";

export type CardPadding = "0" | "8" | "16" | "24";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
  variant?: CardVariant;
  fullscreen?: boolean;
  padding?: CardPadding;
  border?: CardBorder;
}

const mapPaddingToClass: Record<CardPadding, string> = {
  "0": "padding_0",
  "8": "padding_8",
  "16": "padding_16",
  "24": "padding_24",
};
const mapBorderToClass: Record<CardBorder, string> = {
  round: "border_round",
  default: "border_default",
};

export const Card = memo(
  ({
    className,
    children,
    variant = "default",
    fullscreen,
    padding = "8",
    border = "round",
    ...otherProps
  }: CardProps) => {
    const paddingClass = mapPaddingToClass[padding];
    const borderClass = mapBorderToClass[border];

    return (
      <div
        className={cx(
          cls.card,
          {
            [cls.fullscreen]: fullscreen,
          },
          [className, cls[variant], cls[paddingClass], cls[borderClass]]
        )}
        {...otherProps}
      >
        {children}
      </div>
    );
  }
);
