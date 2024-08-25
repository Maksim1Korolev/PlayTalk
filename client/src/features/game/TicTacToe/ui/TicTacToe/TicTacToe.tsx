import { memo, useState } from "react";
import cls from "./TicTacToe.module.scss";
import { cx } from "@/shared/lib/cx";
import { Board } from "../Board";
import { useCookies } from "react-cookie";
import { User } from "@/entities/User";
import { useTicTacToeSocket } from "../../hooks/useTicTacToeSocket";
import { UiButton } from "@/shared/ui";

interface TicTacToeProps {
  className?: string;
  game: Game;
}

export const TicTacToe = memo(({ className, game }: TicTacToeProps) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const currentUser: User = cookies["jwt-cookie"]?.user;

  const [currentPlayer, setCurrentPlayer] = useState(game.currentPlayer);

  const [board, setBoard] = useState<("-" | "O" | "X")[]>(game.board);

  const opponentUsername =
    currentUser.username === game.player1.username
      ? game.player2.username
      : game.player1.username;

  const changePlayers = () => {
    setCurrentPlayer(prevPlayer =>
      prevPlayer === game.player1.username
        ? game.player2.username
        : game.player1.username
    );
  };

  const getPlayerSign = (username: string) => {
    return username === game.player1.username
      ? game.player1.sign
      : game.player2.sign;
  };

  const onMakeMove = ({ interactingIndex }: { interactingIndex: number }) => {
    if (currentPlayer === currentUser.username) {
      handleMakeMove({ opponentUsername, interactingIndex });
    } else {
      console.log("Invalid move!");
    }
  };

  const onMoveMade = ({
    interactingUsername,
    interactingIndex,
  }: {
    interactingUsername: string;
    interactingIndex: number;
  }) => {
    const playerSign = getPlayerSign(interactingUsername);

    setBoard(prevBoard =>
      prevBoard.map((sign, index) =>
        index === interactingIndex ? playerSign : sign
      )
    );
    console.log("interactingUsername:");
    console.log(interactingUsername);
    console.log("interactingIndex:");
    console.log(interactingIndex);
    console.log("board:");
    console.log(board);

    changePlayers();
  };

  const { handleMakeMove, handleSurrender } = useTicTacToeSocket({
    onMoveMade,
  });

  return (
    <div className={cx(cls.TicTacToe, {}, [className])}>
      <div>Current player is: {currentPlayer}</div>
      <Board board={board} onMakeMove={onMakeMove} />
      <UiButton onClick={() => handleSurrender({ opponentUsername })}>
        Surrender
      </UiButton>
    </div>
  );
});
