import { memo, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { gameApiService } from "@/shared/api";
import { useAppSelector } from "@/shared/lib";
import {
  AddonCircleProps,
  AppImage,
  CircleModal,
  useModalPosition,
} from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import {
  Game,
  GameData,
  GameModalData,
  TicTacToeGame,
} from "@/entities/game/Game";
import { Modal } from "@/entities/Modal";
import { getUsers } from "@/entities/User";
import { TicTacToe } from "@/features/game";

import { generateModalId } from "../hooks/useGameModals";

interface GameModalsProps {
  gameModals: Modal<GameModalData>[];
  onClose: ({ modalId }: { modalId: string }) => void;
}

export const GameModals = memo(({ gameModals, onClose }: GameModalsProps) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const { token } = cookies["jwt-cookie"];

  const [games, setGames] = useState<{ [key: string]: Game }>({});

  const users = useAppSelector(getUsers);
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
      const { opponentUsername, gameName } = gameData;

      const headerString = `Opponent: ${opponentUsername}`;

      const position = getStartingPosition();

      const gameId: string = generateModalId(gameData);

      if (!games[gameId]) return null;

      switch (gameData.gameName) {
        case "tic-tac-toe":
          return (
            <CircleModal
              key={modalId}
              position={position}
              width={365}
              height={520}
              onClose={() => handleCloseGameModal(modalId)}
              headerString={headerString}
              addonCircleProps={getAddonCircleProps(opponentUsername, gameName)}
            >
              <TicTacToe key={gameId} game={games[gameId] as TicTacToeGame} />
            </CircleModal>
          );
        default:
          return <div>No game found</div>;
      }
    };

    const getAddonCircleProps = (
      opponentUsername: string,
      currentGameName: string
    ): AddonCircleProps => {
      const opponentAvatarFileName = users[opponentUsername]?.avatarFileName;

      const gameIconUrl = getImagePath({
        collection: "gameIcons",
        fileName: currentGameName,
      });
      const avatarIconUrl = getImagePath({
        collection: "avatars",
        fileName: opponentAvatarFileName,
      });

      return {
        iconProps: {
          src: gameIconUrl,
          width: 80,
          height: 80,
          draggable: false,
          highlight: "primary",
        },
        addonTopRight: avatarIconUrl ? (
          <AppImage
            src={avatarIconUrl}
            width={30}
            height={30}
            draggable={false}
          />
        ) : null,
      };
    };

    const handleCloseGameModal = (modalId: string) => {
      onClose({ modalId });
    };

    return gameModals.map(({ modalId, data }) => {
      return getGameComponent({ modalId, gameData: data });
    });
  }, [gameModals, games, users, onClose, getStartingPosition]);

  return renderGameModals();
});
