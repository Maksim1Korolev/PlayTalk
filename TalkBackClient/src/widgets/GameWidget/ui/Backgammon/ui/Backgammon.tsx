import { Board } from "@/features/Backgammon";
import cls from "./Backgammon.module.scss";
import { cx } from "@/shared/lib/cx";
import { BoardBorder } from "@/features/Backgammon/ui/BoardBorder";
import { Card, UiButton } from "@/shared/ui";

export const Backgammon = ({
  className,
  handleConcedeButton,
}: {
  className?: string;
  handleConcedeButton: () => void;
}) => {
  return (
    <Card className={cx(cls.Backgammon, {}, [className])}>
      <BoardBorder>
      {/* <OuterBoard/> */}
        <Board />
      </BoardBorder>
      <UiButton onClick={handleConcedeButton}>Concede</UiButton>
    </Card>
  );
};
