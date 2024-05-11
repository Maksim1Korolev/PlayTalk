import cls from "./GameWidget.module.scss";
import { cx } from "@/shared/lib/cx";
import { Backgammon } from "./Backgammon";

export const GameWidget = ({
  className,
  handleConcede,
  inGame,
}: {
  className?: string;
  handleConcede: () => void;
  inGame: boolean;
}) => {
  return (
    <div className={cx(cls.GameWidget, {}, [className])}>
      {inGame ? (
        <Backgammon handleConcedeButton={handleConcede} />
      ) : (
        <div>ZAGLUSHKA</div>
      )}
    </div>
  );
};
