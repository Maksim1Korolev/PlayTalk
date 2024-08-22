import { memo, useState, useEffect } from "react";
import cls from "./TicTacToe.module.scss";
import { cx } from "@/shared/lib/cx";
import { Board } from "../Board";
import { useCookies } from "react-cookie";
import { User } from "@/entities/User";

interface Player {
  username: string;
  sign: "O" | "X";
}

interface Game {
  player1: Player;
  player2: Player;
  currentPlayer: string;
  board: Array<"-" | "O" | "X">;
}

interface TicTacToeProps {
  className?: string;
  game: Game;
  onMakeMove: () => void;
}

export const TicTacToe = memo(
  ({ className, game, onMakeMove }: TicTacToeProps) => {
    const [cookies] = useCookies(["jwt-cookie"]);
    const currentUser: User = cookies["jwt-cookie"]?.user;

    const [currentPlayer, setCurrentPlayer] = useState(game.currentPlayer);
    const [isActiveTurn, setIsActiveTurn] = useState(
      currentPlayer === currentUser.username
    );

    useEffect(() => {
      setIsActiveTurn(currentPlayer === currentUser.username);
    }, [currentPlayer]);

    const handleMakeMove = () => {
      onMakeMove();
      changePlayers();
    };

    const changePlayers = () => {
      setCurrentPlayer(prevPlayer =>
        prevPlayer === game.player1.username
          ? game.player2.username
          : game.player1.username
      );
    };

    const getSign = () => {
      return game.player1.username === currentUser.username
        ? game.player1.sign
        : game.player2.sign;
    };

    return (
      <div className={cx(cls.TicTacToe, {}, [className])}>
        <div>Current player is: {currentPlayer}</div>
        <Board
          board={game.board}
          playerSign={getSign()}
          isActiveTurn={isActiveTurn}
          onMakeMove={handleMakeMove}
        />
      </div>
    );
  }
);
