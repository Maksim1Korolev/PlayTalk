import { memo, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { gameApiService } from "@/shared/api/services/gameApiService";
import { useAppSelector } from "@/shared/lib";
import { AddonCircleProps, AppImage, CircleModal } from "@/shared/ui";
import { useModalPosition } from "@/shared/ui/CircleModal";
import getImagePath from "@/shared/utils/getImagePath";

import { Game, GameData, TicTacToeGame } from "@/entities/game/Game";
import { Modal } from "@/entities/Modal";
import { getUsers, User } from "@/entities/User";
import { TicTacToe } from "@/features/game";

import { generateModalId } from "../hooks/useGameModals";

interface GameModalsProps {
  gameModals: Modal<GameData>[];
  onClose: ({ modalId }: { modalId: string }) => void;
}

export const GameModals = memo(({ gameModals, onClose }: GameModalsProps) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const { currentUsername, token } = cookies["jwt-cookie"];

  const users = useAppSelector(getUsers);

  const [games, setGames] = useState<{ [key: string]: Game }>({});
  const [iconMap, setIconMap] = useState<{ [key: string]: string }>({});
  const [avatarMap, setAvatarMap] = useState<{ [key: string]: string }>({});

  const { getStartingPosition } = useModalPosition();

  //TODO: search another way to fetch only one game that opens right now
  useEffect(() => {
    const fetchGames = async () => {
      const fetchedGames = await Promise.all(
        gameModals.map(async modal => {
          const fetchedGame: Game = await gameApiService.getGame(token, {
            gameName: modal.data.gameName,
            opponentUsername: modal.data.opponentUsername,
          });
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

  useEffect(() => {
    const loadIcons = async () => {
      const icons: { [key: string]: string } = {};
      const avatars: { [key: string]: string } = {};

      for (const modal of gameModals) {
        const { data } = modal;
        const { gameName, opponentUsername } = data;

        icons[gameName] = getImagePath({
          collection: "gameIcons",
          fileName: gameName,
        });

        const opponentUser = users.find(
          (user: User) => user.username === opponentUsername
        );
        avatars[opponentUsername] = getImagePath({
          collection: "avatars",
          fileName: opponentUser?.avatarFileName,
        });
      }

      setIconMap(icons);
      setAvatarMap(avatars);
    };

    if (gameModals.length > 0) {
      loadIcons();
    }
  }, [gameModals, users]);

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
      const gameIconUrl = iconMap[currentGameName];
      const avatarIconUrl = avatarMap[opponentUsername];

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
      const headerString = `Opponent: ${data.opponentUsername}`;
      const { opponentUsername, gameName } = data;

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
  }, [gameModals, games, iconMap, avatarMap, onClose, getStartingPosition]);

  return renderGameModals();
});
