import { ReactNode, memo } from "react";
import cls from "./UiText.module.scss";
import { Mods, cx } from "@/shared/lib/cx";

export type TextSize = "s" | "m" | "l" | "xl" | "xxl";
export type FontFamily = "main" | "monospace" | "text" | "header";

interface UiTextProps {
  className?: string;
  children?: ReactNode;
  size?: TextSize;
  bold?: boolean;
  dimmed?: boolean;
  max?: boolean;
  fontFamily?: FontFamily;
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

export const UiText = memo(
  ({
    className,
    children,
    size = "m",
    bold = false,
    dimmed = false,
    max = false,
    fontFamily = "text",
  }: UiTextProps) => {
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
        ])}
      >
        {children}
      </p>
    );
  }
);
