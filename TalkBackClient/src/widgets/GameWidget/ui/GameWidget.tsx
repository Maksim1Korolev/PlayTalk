import cls from "./GameWidget.module.scss";
import { cx } from "@/shared/lib/cx";
import { Backgammon } from "./Backgammon";

export const GameWidget = ({
  className,
  inGame = false,
}: {
  className?: string;
  inGame?: boolean;
}) => {
  return (
    <div className={cx(cls.GameWidget, {}, [className])}>
      {inGame ? <div>ZAGLUSHKA</div> : <Backgammon />}
    </div>
  );
};
