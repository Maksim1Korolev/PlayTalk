import { memo, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { gameApiService } from "@/shared/api";
import { Loader } from "@/shared/ui";

import { Game, GameModalData } from "@/entities/game/Game";
import { TicTacToeGame } from "@/entities/game/Game";
import { TicTacToe } from "@/features/game";

interface GameContainerProps {
  gameData: GameModalData;
}

export const GameContainer = memo(({ gameData }: GameContainerProps) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const { token } = cookies["jwt-cookie"];
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      const fetchedGame: Game = await gameApiService.getGame(token, gameData);
      setGame(fetchedGame);
    };

    fetchGame();
  }, [token, gameData]);

  if (!game) {
    return <Loader />;
  }

  switch (gameData.gameName) {
    case "tic-tac-toe":
      return <TicTacToe game={game as TicTacToeGame} />;
    default:
      return <div>No game found</div>;
  }
});
