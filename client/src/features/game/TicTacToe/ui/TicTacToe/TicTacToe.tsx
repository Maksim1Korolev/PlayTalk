import { memo } from "react";
import cls from "./TicTacToe.module.scss";
import { cx } from "@/shared/lib/cx";
import { Board } from "../Board";
import { useCookies } from "react-cookie";
import { User } from "@/entities/User";

export const TicTacToe = ({
  className,
  game,
}: {
  className?: string;
  game: Game;
}) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const currentUser: User = cookies["jwt-cookie"]?.user;

  const getSign = () => {
    if (game.player1.username === currentUser.username) {
      return game.player1.sign;
    }
    return game.player2.sign;
  };

  const sign = getSign();

  return (
    <div className={cx(cls.TicTacToe, {}, [className])}>
      <Board board={game.board} />
    </div>
  );
};
