import { ReactNode, memo } from "react";
import cls from "./BoardBorder.module.scss";
import { cx } from "@/shared/lib/cx";

export const BoardBorder = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return <div className={cx(cls.BoardBorder, {}, [className])}>{children}</div>;
};
