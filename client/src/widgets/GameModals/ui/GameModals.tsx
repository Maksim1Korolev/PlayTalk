import { memo, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { gameApiService } from "@/shared/api";
import { CircleModal, useModalPosition } from "@/shared/ui";

import {
  Game,
  GameData,
  GameModalData,
  TicTacToeGame,
} from "@/entities/game/Game";
import { Modal } from "@/entities/Modal";
import { TicTacToe } from "@/features/game";
import { GameAddonCircleContainer } from "@/features/game/GameAddonCircleContainer";

import { generateModalId } from "../hooks/useGameModals";

interface GameModalsProps {
  gameModals: Modal<GameModalData>[];
  onClose: ({ modalId }: { modalId: string }) => void;
}

export const GameModals = memo(({ gameModals, onClose }: GameModalsProps) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const { token } = cookies["jwt-cookie"];

  const [games, setGames] = useState<{ [key: string]: Game }>({});

  const { getStartingPosition } = useModalPosition();

  useEffect(() => {
    const fetchGames = async () => {
      const gameIdsInState = Object.keys(games);

      const gamesToFetch = gameModals.filter((modal) => {
        const gameId = generateModalId(modal.data);
        return !gameIdsInState.includes(gameId);
      });

      if (gamesToFetch.length === 0) {
        return;
      }

      const fetchedGames = await Promise.all(
        gamesToFetch.map(async (modal) => {
          const { data } = modal;

          const fetchedGame: Game = await gameApiService.getGame(token, data);
          return {
            id: generateModalId(modal.data),
            game: fetchedGame,
          };
        })
      );

      const newGamesMap = fetchedGames.reduce(
        (acc, { id, game }) => ({ ...acc, [id]: game }),
        {}
      );

      setGames((prevGames) => ({ ...prevGames, ...newGamesMap }));
    };

    fetchGames();
  }, [gameModals, token, games]);

  const renderGameModals = useCallback(() => {
    const getGameComponent = ({
      modalId,
      gameData,
    }: {
      modalId: string;
      gameData: GameData;
    }) => {
      const { opponentUsername } = gameData;

      const headerString = `Opponent: ${opponentUsername}`;

      const position = getStartingPosition();

      const gameId: string = generateModalId(gameData);

      if (!games[gameId]) return null;

      switch (gameData.gameName) {
        case "tic-tac-toe":
          return (
            <CircleModal
              key={modalId}
              headerString={headerString}
              position={position}
              width={365}
              height={520}
              collapsedComponent={
                <GameAddonCircleContainer gameData={gameData} />
              }
              onClose={() => handleCloseGameModal(modalId)}
            >
              <TicTacToe key={gameId} game={games[gameId] as TicTacToeGame} />
            </CircleModal>
          );
        default:
          return <div>No game found</div>;
      }
    };

    const handleCloseGameModal = (modalId: string) => {
      onClose({ modalId });
    };

    return gameModals.map(({ modalId, data }) =>
      getGameComponent({ modalId, gameData: data })
    );
  }, [gameModals, games, onClose, getStartingPosition]);

  return renderGameModals();
});
