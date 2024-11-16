import cls from "./Card.module.scss";

import { HTMLAttributes, memo, ReactNode } from "react";

import { cx } from "@/shared/lib";
import { BlurredBackground } from "@/shared/ui";

type CardVariant = "default" | "outlined" | "light" | "blurred" | "matte";
type CardBorder = "default" | "round" | "none";

type CardPadding = "0" | "8" | "16" | "24" | "32" | "45" | "60";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
  variant?: CardVariant;
  max?: boolean;
  padding?: CardPadding;
  border?: CardBorder;
}

const mapPaddingToClass: Record<CardPadding, string> = {
  "0": "padding_0",
  "8": "padding_8",
  "16": "padding_16",
  "24": "padding_24",
  "32": "padding_32",
  "45": "padding_45",
  "60": "padding_60",
};
const mapBorderToClass: Record<CardBorder, string> = {
  round: "border_round",
  default: "border_default",
  none: "",
};

export const Card = memo(
  ({
    className,
    children,
    variant = "default",
    max,
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
            [cls.max]: max,
          },
          [className, cls[variant], cls[paddingClass], cls[borderClass]]
        )}
        {...otherProps}
      >
        {variant === "blurred" && <BlurredBackground />}
        {children}
      </div>
    );
  }
);
