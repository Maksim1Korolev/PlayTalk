import { memo } from "react";
import cls from "./TicTacToe.module.scss";
import { cx } from "@/shared/lib/cx";
import { Board } from "../Board";

export const TicTacToe = ({
  className,
  game,
}: {
  className?: string;
  game: Game;
}) => {
  return (
    <div className={cx(cls.TicTacToe, {}, [className])}>
      <Board board={game.board} />
    </div>
  );
};
