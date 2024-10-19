import { DetailedHTMLProps, HTMLAttributes, ReactNode, memo } from "react";

import cls from "./Flex.module.scss";
import { Mods, cx } from "@/shared/lib";

type FlexJustify = "start" | "center" | "end" | "between";
type FlexWrap = "nowrap" | "wrap";
type FlexAlign = "start" | "center" | "end";
type FlexDirection = "row" | "column";
type FlexGap = "4" | "8" | "16" | "24" | "32" | "45" | "60";

const justifyClasses: Record<FlexJustify, string> = {
  start: cls.justifyStart,
  center: cls.justifyCenter,
  end: cls.justifyEnd,
  between: cls.justifyBetween,
};

const alignClasses: Record<FlexAlign, string> = {
  start: cls.alignStart,
  center: cls.alignCenter,
  end: cls.alignEnd,
};

const directionClasses: Record<FlexDirection, string> = {
  row: cls.directionRow,
  column: cls.directionColumn,
};

const gapClasses: Record<FlexGap, string> = {
  4: cls.gap4,
  8: cls.gap8,
  16: cls.gap16,
  24: cls.gap24,
  32: cls.gap32,
  45: cls.gap45,
  60: cls.gap60,
};

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface FlexProps extends DivProps {
  className?: string;
  children: ReactNode;
  justify?: FlexJustify;
  align?: FlexAlign;
  wrap?: FlexWrap;
  direction?: FlexDirection;
  gap?: FlexGap;
  isReverted?: boolean;
  max?: boolean;
}

export const Flex = memo(
  ({
    className,
    children,
    justify = "start",
    align = "center",
    direction = "row",
    gap,
    max,
    isReverted,
    wrap = "nowrap",
    ...otherProps
  }: FlexProps) => {
    const classes = [
      className,
      justifyClasses[justify],
      alignClasses[align],
      directionClasses[direction],
      gap && gapClasses[gap],
      cls[wrap],
    ];

    const mods: Mods = {
      [cls.max]: max,
      [cls.isReverted]: isReverted,
    };

    return (
      <div {...otherProps} className={cx(cls.flex, mods, classes)}>
        {children}
      </div>
    );
  }
);
