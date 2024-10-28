import cls from "./TicTacToe.module.scss";

import { memo, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import resources from "@/shared/assets/locales/en/games/TicTacToeResources.json";

import { cx } from "@/shared/lib";
import { UiButton, UiText, VStack } from "@/shared/ui";

import { TicTacToeGame } from "@/entities/Game";
import { User } from "@/entities/User";

import { useTicTacToeSocket } from "../../hooks/useTicTacToeSocket";
import { Board } from "../Board";

interface TicTacToeProps {
  className?: string;
  game: TicTacToeGame;
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
      setStatusMessage(resources.notYourTurn);
      return;
    }

    if (board[interactingIndex] !== "-") {
      setStatusMessage(resources.squareOccupied);
      return;
    }

    handleMakeMove({ opponentUsername, interactingIndex });
    onMoveMade({ interactingUsername: currentUser.username, interactingIndex });
  };

  const onMoveMade = ({
    interactingUsername,
    interactingIndex,
  }: {
    interactingUsername: string;
    interactingIndex: number;
  }) => {
    if (interactingUsername !== currentPlayer) {
      return;
    }

    const playerSign = getPlayerSign(interactingUsername);

    setBoard(prevBoard =>
      prevBoard.map((sign, index) =>
        index === interactingIndex ? playerSign : sign
      )
    );

    changePlayers();
    setStatusMessage("");
  };

  useEffect(() => {
    if (statusMessage !== "") {
      const timer = setTimeout(() => {
        setStatusMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const { handleMakeMove, handleSurrender } = useTicTacToeSocket({
    onMoveMade,
  });

  return (
    <VStack max className={cx(cls.TicTacToe, {}, [className])}>
      <UiText max className={cls.statusMessage}>
        {currentPlayer === currentUser.username
          ? resources.yourTurn
          : resources.opponentsTurn.replace("{opponent}", currentPlayer)}
      </UiText>
      {statusMessage && (
        <UiText max className={cls.statusMessage}>
          {statusMessage}
        </UiText>
      )}
      <div className={cls.boardContainer}>
        <Board board={board} onMakeMove={onMakeMove} />
      </div>
      <UiButton
        max
        className={cls.surrenderButton}
        onClick={() => handleSurrender({ opponentUsername })}
      >
        {resources.surrenderButton}
      </UiButton>
    </VStack>
  );
});
