import cls from "./UiText.module.scss";

import { forwardRef, ReactNode } from "react";

import { cx, Mods } from "@/shared/lib";

type FontFamily = "main" | "monospace" | "text" | "header";

type TextColor = "error" | "default" | "black";

interface UiTextProps {
  className?: string;
  children?: ReactNode;
  size?: TextSize;
  bold?: boolean;
  dimmed?: boolean;
  color?: TextColor;
  max?: boolean;
  fontFamily?: FontFamily;
  title?: string;
}

const mapSizeToClass: Record<TextSize, string> = {
  s: "s",
  m: "m",
  l: "l",
  xl: "xl",
  xxl: "xxl",
};

const mapFontFamilyToClass: Record<FontFamily, string> = {
  main: "font-family-main",
  monospace: "font-family-monospace",
  text: "font-family-text",
  header: "font-family-header",
};

export const UiText = forwardRef<HTMLParagraphElement, UiTextProps>(
  (
    {
      className,
      children,
      size = "m",
      color = "default",
      bold = false,
      dimmed = false,
      max = false,
      fontFamily = "text",
      title,
    }: UiTextProps,
    ref
  ) => {
    const sizeClass = mapSizeToClass[size];
    const fontFamilyClass = mapFontFamilyToClass[fontFamily];
    const textMods: Mods = {
      [cls.bold]: bold,
      [cls.dimmed]: dimmed,
      [cls.max]: max,
    };
    return (
      <p
        className={cx(cls.UiText, textMods, [
          className,
          cls[sizeClass],
          cls[fontFamilyClass],
          cls[color],
        ])}
        title={title}
        ref={ref}
      >
        {children}
      </p>
    );
  }
);
