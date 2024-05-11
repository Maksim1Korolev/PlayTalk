import cls from "./GameWidget.module.scss";
import { cx } from "@/shared/lib/cx";
import { Backgammon } from "./Backgammon";
import { useCallback } from "react";
import { useConnectToGame } from "@/pages/OnlinePage/hooks/useConnectionGameSocket";

export const GameWidget = ({
  className,
  handleConcede,
  inGame,
}: {
  className?: string;
  handleConcede: () => void;
  inGame: boolean;
}) => {
  const startGame = useCallback(() => {
    console.log("123123123123123123123123");
  }, []);

  //TODO:Maybe move to onlinePage and pass from there
  useConnectToGame(startGame);

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
