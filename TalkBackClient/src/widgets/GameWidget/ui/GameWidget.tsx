import cls from "./GameWidget.module.scss";
import { cx } from "@/shared/lib/cx";
import { Backgammon } from "./Backgammon";
import { useState } from "react";
import { useConnectToGame } from "@/pages/OnlinePage/hooks/useConnectionGameSocket";

export const GameWidget = ({ className }: { className?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = ({ opponentUsername }: { opponentUsername: string }) => {
    setIsPlaying(true);
  };
  //TODO:Maybe move to onlinePage and pass from there
  useConnectToGame(startGame);

  return (
    <div className={cx(cls.GameWidget, {}, [className])}>
      {isPlaying ? <Backgammon /> : <div>ZAGLUSHKA</div>}
    </div>
  );
};
