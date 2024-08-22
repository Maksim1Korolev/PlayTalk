import { memo } from "react";
import cls from "./Board.module.scss";
import { cx } from "@/shared/lib/cx";
import { Card } from "@/shared/ui";
import { Box } from "../Box";

interface BoardProps {
  className?: string;
  board: Array<"-" | "O" | "X">;
  isActiveTurn: boolean;
  playerSign: "O" | "X";
  onMakeMove: () => void;
}

export const Board = memo(
  ({ className, board, isActiveTurn, playerSign, onMakeMove }: BoardProps) => {
    return (
      <Card className={cx(cls.TicTacToeBoard, {}, [className])}>
        {board.map((sign, index) => (
          <Box
            key={index}
            sign={sign}
            playerSign={playerSign}
            isActiveTurn={isActiveTurn}
            onMakeMove={onMakeMove}
          />
        ))}
      </Card>
    );
  }
);
