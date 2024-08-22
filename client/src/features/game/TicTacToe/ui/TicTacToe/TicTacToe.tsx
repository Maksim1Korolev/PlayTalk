import { memo } from "react";
import cls from "./TicTacToe.module.scss";
import { cx } from "@/shared/lib/cx";

export const TicTacToe = ({ className }: { className?: string }) => {
  return <div className={cx(cls.TicTacToe, {}, [className])}></div>;
};
