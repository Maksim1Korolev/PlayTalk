import { ReactNode } from "react";
import cls from "./UiText.module.scss";
import { Mods, cx } from "@/shared/lib/cx";

export type TextSize = "s" | "m" | "l" | "xl" | "xxl";

export const UiText = ({
  children,
  className,
  size = "m",
  bold,
  dimmed,
}: {
  children?: ReactNode;
  className?: string;
  size?: TextSize;
  bold?: boolean;
  dimmed?: boolean;
}) => {
  const textMods: Mods = {
    [cls.bold]: bold,
    [cls.dimmed]: dimmed,
  };

  return (
    <p className={cx(cls.UiInput, textMods, [className, cls[size]])}>
      {children}
    </p>
  );
};
