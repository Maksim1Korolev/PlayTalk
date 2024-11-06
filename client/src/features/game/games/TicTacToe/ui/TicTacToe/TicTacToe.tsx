import cls from "./TicTacToe.module.scss";

import { memo, useEffect, useState } from "react";

import { ticTacToeResources } from "@/shared/assets";

import { cx, useAppSelector } from "@/shared/lib";
import { UiButton, UiText, VStack } from "@/shared/ui";

import { TicTacToeGame } from "@/entities/game/Game";
import { CurrentUser, getCurrentUser } from "@/entities/User";

import { useTicTacToeSocket } from "../../hooks/useTicTacToeSocket";
import { Board } from "../Board";

interface TicTacToeProps {
  className?: string;
  game: TicTacToeGame;
}

export const TicTacToe = memo(({ className, game }: TicTacToeProps) => {
  const currentUser: CurrentUser = useAppSelector(getCurrentUser);

  const [currentPlayer, setCurrentPlayer] = useState(game.currentPlayer);
  const [statusMessage, setStatusMessage] = useState("");

  const [board, setBoard] = useState<("-" | "O" | "X")[]>(game.board);

  const opponentUsername =
    currentUser!.username === game.player1.username
      ? game.player2.username
      : game.player1.username;

  const changePlayers = () => {
    setCurrentPlayer((prevPlayer) =>
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
    if (currentPlayer !== currentUser!.username) {
      setStatusMessage(ticTacToeResources.notYourTurn);
      return;
    }

    if (board[interactingIndex] !== "-") {
      setStatusMessage(ticTacToeResources.squareOccupied);
      return;
    }

    handleMakeMove({ opponentUsername, interactingIndex });
    onMoveMade({
      interactingUsername: currentUser!.username,
      interactingIndex,
    });
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

    setBoard((prevBoard) =>
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
        {currentPlayer === currentUser!.username
          ? ticTacToeResources.yourTurn
          : ticTacToeResources.opponentsTurn.replace(
              "{opponent}",
              currentPlayer
            )}
      </UiText>
      <div className={cls.boardContainer}>
        {statusMessage && (
          <UiText max className={cls.warningMessage}>
            {statusMessage}
          </UiText>
        )}
        <Board board={board} onMakeMove={onMakeMove} />
      </div>
      <UiButton
        max
        className={cls.surrenderButton}
        onClick={() => handleSurrender({ opponentUsername })}
      >
        {ticTacToeResources.surrenderButton}
      </UiButton>
    </VStack>
  );
});
