import { Board } from "@/features/Backgammon";
import cls from "./Backgammon.module.scss";
import { cx } from "@/shared/lib/cx";
import { BoardBorder } from "@/features/Backgammon/ui/BoardBorder";

export const Backgammon = ({ className }: { className?: string }) => {
  return (
    <div className={cx(cls.Backgammon, {}, [className])}>
      <BoardBorder>
        <Board />
      </BoardBorder>
    </div>
  );
};
