import { Board } from "@/features/Backgammon";
import cls from "./Backgammon.module.scss";
import { cx } from "@/shared/lib/cx";
import { BoardBorder } from "@/features/Backgammon/ui/BoardBorder";
import { UiButton } from "@/shared/ui";

export const Backgammon = ({
  className,
  handleConcedeButton,
}: {
  className?: string;
  handleConcedeButton: () => void;
}) => {
  return (
    <div className={cx(cls.Backgammon, {}, [className])}>
      <BoardBorder>
        <Board />
      </BoardBorder>
      <UiButton onClick={handleConcedeButton}>Concede</UiButton>
    </div>
  );
};
