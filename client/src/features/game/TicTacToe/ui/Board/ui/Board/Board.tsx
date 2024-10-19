import cls from "./Board.module.scss";
import { cx } from "@/shared/lib";
import { memo } from "react";

import { Card } from "@/shared/ui";
import { Square } from "../Square/ui/Square";

interface BoardProps {
  className?: string;
  board: Array<"-" | "O" | "X">;
  onMakeMove: ({ interactingIndex }: { interactingIndex: number }) => void;
}

export const Board = memo(({ className, board, onMakeMove }: BoardProps) => {
  return (
    <Card className={cx(cls.Board, {}, [className])}>
      {[0, 1, 2].map(row => (
        <div key={row} className={cls.row}>
          {board.slice(row * 3, row * 3 + 3).map((sign, index) => (
            <Square
              key={index + row * 3}
              index={index + row * 3}
              sign={sign}
              onMakeMove={onMakeMove}
            />
          ))}
        </div>
      ))}
    </Card>
  );
});
