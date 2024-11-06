import { memo, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { gameApiService } from "@/shared/api/services/gameApiService";
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
  const { currentUsername, token } = cookies["jwt-cookie"];

  const [games, setGames] = useState<{ [key: string]: Game }>({});

  const users = useAppSelector(getUsers);
  const { getStartingPosition } = useModalPosition();

  //TODO: search another way to fetch only one game that opens right now
  useEffect(() => {
    const fetchGames = async () => {
      const fetchedGames = await Promise.all(
        gameModals.map(async modal => {
          const { data } = modal;

          const fetchedGame: Game = await gameApiService.getGame(token, data);
          return {
            id: generateModalId(modal.data),
            game: fetchedGame,
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
  }, [gameModals, currentUsername, token]);

  const renderGameModals = useCallback(() => {
    const getGameComponent = (gameData: GameData) => {
      const gameId: string = generateModalId(gameData);

      if (!games[gameId]) return null;

      switch (gameData.gameName) {
        case "tic-tac-toe":
          return (
            <TicTacToe key={gameId} game={games[gameId] as TicTacToeGame} />
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
      const { opponentUsername, gameName } = data;

      const headerString = `Opponent: ${opponentUsername}`;

      const position = getStartingPosition();

      return (
        <CircleModal
          key={modalId}
          position={position}
          onClose={() => handleCloseGameModal(modalId)}
          headerString={headerString}
          addonCircleProps={getAddonCircleProps(opponentUsername, gameName)}
        >
          {getGameComponent(data)}
        </CircleModal>
      );
    });
  }, [gameModals, games, users, onClose, getStartingPosition]);

  return renderGameModals();
});
