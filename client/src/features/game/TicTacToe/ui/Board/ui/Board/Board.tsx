import { memo } from "react";
import cls from "./Board.module.scss";
import { cx } from "@/shared/lib/cx";
import { Card } from "@/shared/ui";
import { Box } from "../Box";

export const Board = ({
  className,
  board,
}: {
  className?: string;
  board: Array<"-" | "O" | "X">;
}) => {
  return (
    <Card className={cx(cls.TicTacToeBoard, {}, [className])}>
      {board.map(sign => (
        <Box sign={sign} />
      ))}
    </Card>
  );
};
