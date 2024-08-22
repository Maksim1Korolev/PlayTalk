import { memo } from "react";
import cls from "./Box.module.scss";
import { cx } from "@/shared/lib/cx";
import { Card } from "@/shared/ui";

export const Box = ({
  className,
  sign,
}: {
  className?: string;
  sign: string;
}) => {
  return (
    <Card className={cx(cls.TicTacToeBox, {}, [className])}>
      <div>{sign}</div>
    </Card>
  );
};
