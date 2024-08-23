import { memo, useEffect, useState } from "react";
import cls from "./GameModals.module.scss";
import { cx } from "@/shared/lib/cx";
import { gameApiService } from "@/pages/OnlinePage/api/gameApiService";
import { useCookies } from "react-cookie";
import { User } from "@/entities/User";
import { TicTacToe } from "@/features/game/TicTacToe/";

export interface GameModalStateProps {
  opponentUsername: string;
  gameName: string;
  position?: {
    x: number;
    y: number;
  };
}

export const GameModals = memo(
  ({
    className,
    gameModals,
  }: {
    className?: string;
    gameModals: GameModalStateProps[];
  }) => {
    const [cookies] = useCookies(["jwt-cookie"]);
    const currentUser: User = cookies["jwt-cookie"]?.user;
    const [games, setGames] = useState<{ [key: string]: any }>({});

    useEffect(() => {
      const fetchGames = async () => {
        const fetchedGames = await Promise.all(
          gameModals.map(async modal => {
            const game = await gameApiService.getGame({
              gameName: modal.gameName,
              player1Username: currentUser.username,
              player2Username: modal.opponentUsername,
            });
            return { id: `${modal.opponentUsername}-${modal.gameName}`, game };
          })
        );

        const gamesMap = fetchedGames.reduce(
          (acc, { id, game }) => ({ ...acc, [id]: game }),
          {}
        );
        setGames(gamesMap);
      };

      fetchGames();
    }, [gameModals, currentUser.username]);

    const getGameComponent = (opponentUsername: string, gameName: string) => {
      const gameId = `${opponentUsername}-${gameName}`;
      const game = games[gameId];

      if (!game) return null;

      switch (gameName) {
        case "tic-tac-toe":
          return <TicTacToe key={gameId} game={game} />;
        default:
          return <div>No game found</div>;
      }
    };

    return (
      <div className={cx(cls.GameModals, {}, [className])}>
        {gameModals.map(modal =>
          getGameComponent(modal.opponentUsername, modal.gameName)
        )}
      </div>
    );
  }
);
