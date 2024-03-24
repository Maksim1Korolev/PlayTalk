import { ReactNode } from "react";
import cls from "./Card.module.scss";
import { cx } from "../../../lib/cx";

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <div className={cx(cls.Card, {}, [className])}>{children}</div>;
};
