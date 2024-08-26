import { memo, useState } from "react";
import cls from "./TicTacToe.module.scss";
import { cx } from "@/shared/lib/cx";
import { Board } from "../Board";
import { useCookies } from "react-cookie";
import { User } from "@/entities/User";
import { useTicTacToeSocket } from "../../hooks/useTicTacToeSocket";
import { UiButton, UiText } from "@/shared/ui";

interface TicTacToeProps {
  className?: string;
  game: Game;
}

export const TicTacToe = memo(({ className, game }: TicTacToeProps) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const currentUser: User = cookies["jwt-cookie"]?.user;

  const [currentPlayer, setCurrentPlayer] = useState(game.currentPlayer);
  const [statusMessage, setStatusMessage] = useState("");

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
    if (currentPlayer !== currentUser.username) {
      setStatusMessage(`It's ${currentPlayer}'s turn!`);
      return;
    }

    if (board[interactingIndex] !== "-") {
      setStatusMessage("Invalid move! The square is already occupied.");
      return;
    }

    handleMakeMove({ opponentUsername, interactingIndex });
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

    changePlayers();
    setStatusMessage("");
  };

  const { handleMakeMove, handleSurrender } = useTicTacToeSocket({
    onMoveMade,
  });

  return (
    <div className={cx(cls.TicTacToe, {}, [className])}>
      <UiText className={cls.statusMessage}>
        It's {currentPlayer}'s turn!
      </UiText>
      {statusMessage && (
        <UiText className={cls.statusMessage}>{statusMessage}</UiText>
      )}
      <div className={cls.boardContainer}>
        <Board board={board} onMakeMove={onMakeMove} />
      </div>
      <UiButton
        className={cls.surrenderButton}
        onClick={() => handleSurrender({ opponentUsername })}
      >
        Surrender
      </UiButton>
    </div>
  );
});
