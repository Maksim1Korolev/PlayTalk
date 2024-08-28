import { memo, useEffect, useState } from "react";
import cls from "./GameModals.module.scss";
import { cx } from "@/shared/lib/cx";
import { gameApiService } from "@/pages/OnlinePage/api/gameApiService";
import { useCookies } from "react-cookie";
import { User } from "@/entities/User";
import { TicTacToe } from "@/features/game/TicTacToe/";
import { Card, UiButton } from "@/shared/ui";
import { GameModalStateProps } from "@/entities/Game/model/types/gameModalStateProps";
import { CircleModal } from "@/shared/ui/CircleModal";

export const GameModals = memo(
  ({
    className,
    gameModals,
    onClose,
  }: {
    className?: string;
    gameModals: GameModalStateProps[];
    onClose: ({
      opponentUsername,
      gameName,
    }: {
      opponentUsername: string;
      gameName: string;
    }) => void;
  }) => {
    const [cookies] = useCookies(["jwt-cookie"]);
    const currentUser: User = cookies["jwt-cookie"]?.user;
    const [games, setGames] = useState<{ [key: string]: any }>({});

    useEffect(() => {
      const fetchGames = async () => {
        const fetchedGames = await Promise.all(
          gameModals.map(async modal => {
            const data = await gameApiService.getGame({
              gameName: modal.gameName,
              player1Username: currentUser.username,
              player2Username: modal.opponentUsername,
            });
            return {
              id: `${modal.opponentUsername}-${modal.gameName}`,
              game: data.game,
            };
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
        {gameModals.map(modal => (
          <Card>
            <UiButton
              onClick={() =>
                onClose({
                  opponentUsername: modal.opponentUsername,
                  gameName: modal.gameName,
                })
              }
            >
              X
            </UiButton>
            {getGameComponent(modal.opponentUsername, modal.gameName)}
          </Card>
        ))}
      </div>
    );
  }
);
