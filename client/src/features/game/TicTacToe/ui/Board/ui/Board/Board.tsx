import { memo } from "react";
import cls from "./Board.module.scss";
import { cx } from "@/shared/lib/cx";
import { Card } from "@/shared/ui";
import { Box } from "../Box";

interface BoardProps {
  className?: string;
  board: Array<"-" | "O" | "X">;
  onMakeMove: ({ interactingIndex }: { interactingIndex: number }) => void;
}

export const Board = memo(({ className, board, onMakeMove }: BoardProps) => {
  return (
    <Card className={cx(cls.TicTacToeBoard, {}, [className])}>
      {board.map((sign, index) => (
        <Box key={index} index={index} sign={sign} onMakeMove={onMakeMove} />
      ))}
    </Card>
  );
});
