import { memo, useCallback, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import {
  Game,
  GameModalStateProps,
  TicTacToeGame,
} from "@/entities/Game/model/";
import { TicTacToe } from "@/features/game/TicTacToe/";
import { gameApiService } from "@/pages/OnlinePage/api/gameApiService";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { AddonCircleProps, AppImage, CircleModal } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

const generateModalId = (
  opponentUsername: string,
  gameName: string
): string => {
  return `${opponentUsername}_${gameName}`;
};

interface GameModalsProps {
  gameModals: GameModalStateProps[];
  onClose: ({
    opponentUsername,
    gameName,
  }: {
    opponentUsername: string;
    gameName: string;
  }) => void;
}

export const GameModals = memo(({ gameModals, onClose }: GameModalsProps) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const { user: currentUser, token } = cookies["jwt-cookie"];

  const { users } = useContext(UsersContext);
  const [games, setGames] = useState<{ [key: string]: Game }>({});
  const [iconMap, setIconMap] = useState<{ [key: string]: string }>({});
  const [avatarMap, setAvatarMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchGames = async () => {
      const fetchedGames = await Promise.all(
        gameModals.map(async modal => {
          const data = await gameApiService.getGame(token, {
            gameName: modal.gameName,
            player1Username: currentUser.username,
            player2Username: modal.opponentUsername,
          });
          return {
            id: generateModalId(modal.opponentUsername, modal.gameName),
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

  useEffect(() => {
    const loadIcons = async () => {
      const icons: { [key: string]: string } = {};
      const avatars: { [key: string]: string } = {};

      for (const modal of gameModals) {
        const { gameName, opponentUsername } = modal;

        icons[gameName] = getImagePath({ gameName });

        const opponentUser = users.find(
          user => user.username === opponentUsername
        );
        avatars[opponentUsername] = getImagePath({
          avatarFileName: opponentUser?.avatarFileName,
        });
      }

      setIconMap(icons);
      setAvatarMap(avatars);
    };

    loadIcons();
  }, [gameModals, users]);

  const getGameComponent = (opponentUsername: string, gameName: string) => {
    const gameId = generateModalId(opponentUsername, gameName);
    const game: TicTacToeGame = games[gameId] as TicTacToeGame;

    if (!game) return null;

    switch (gameName) {
      case "tic-tac-toe":
        return <TicTacToe key={gameId} game={game} />;
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

  const renderGameModals = useCallback(() => {
    const handleCloseGameModal = (modalId: string) => {
      const [opponentUsername, gameName] = modalId.split("_");
      onClose({ opponentUsername, gameName });
    };

    return gameModals.map(modal => {
      const modalId = generateModalId(modal.opponentUsername, modal.gameName);
      const headerString = `Opponent: ${modal.opponentUsername}`;

      return (
        <CircleModal
          key={modalId}
          onClose={() => handleCloseGameModal(modalId)}
          headerString={headerString}
          addonCircleProps={getAddonCircleProps(
            modal.opponentUsername,
            modal.gameName
          )}
        >
          {getGameComponent(modal.opponentUsername, modal.gameName)}
        </CircleModal>
      );
    });
  }, [gameModals, currentUser, getAddonCircleProps, onClose]);

  return renderGameModals();
});
