import cls from "./GameWidget.module.scss";
import { cx } from "@/shared/lib/cx";
import { Backgammon } from "./Backgammon";
import { useEffect, useState } from "react";
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
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = ({ opponentUsername }: { opponentUsername: string }) => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!inGame) {
      setIsPlaying(false);
    }
  }, [inGame]);

  //TODO:Maybe move to onlinePage and pass from there
  useConnectToGame(startGame);

  const handleConcedeButton = () => {
    handleConcede();
    setIsPlaying(false);
  };

  return (
    <div className={cx(cls.GameWidget, {}, [className])}>
      {isPlaying ? (
        <Backgammon handleConcedeButton={handleConcedeButton} />
      ) : (
        <div>ZAGLUSHKA</div>
      )}
    </div>
  );
};
