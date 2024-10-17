import { memo, useCallback, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import {
  Game,
  GameData,
  GameModal,
  isGameName,
  TicTacToeGame,
} from "@/entities/Game/model/";
import { TicTacToe } from "@/features/game/TicTacToe/";
import { gameApiService } from "@/pages/OnlinePage/api/gameApiService";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { AddonCircleProps, AppImage, CircleModal } from "@/shared/ui";

import getImagePath from "@/shared/utils/getImagePath";

const generateModalId = (gameData: GameData): string => {
  return `${gameData.opponentUsername}_${gameData.gameName}`;
};

interface GameModalsProps {
  gameModals: GameModal[];
  onClose: ({ gameData }: { gameData: GameData }) => void;
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
            gameName: modal.gameData.gameName,
            player1Username: currentUser.username,
            player2Username: modal.gameData.opponentUsername,
          });
          return {
            id: generateModalId(modal.gameData),
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
  }, [gameModals, currentUser.username, token]);

  useEffect(() => {
    const loadIcons = async () => {
      const icons: { [key: string]: string } = {};
      const avatars: { [key: string]: string } = {};

      for (const modal of gameModals) {
        const { gameData } = modal;
        const { gameName, opponentUsername } = gameData;

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

  const renderGameModals = useCallback(() => {
    const getGameComponent = (gameData: GameData) => {
      const gameId: string = generateModalId(gameData);
      const game: TicTacToeGame = games[gameId] as TicTacToeGame;

      if (!game) return null;

      switch (gameData.gameName) {
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

    const handleCloseGameModal = (modalId: string) => {
      const [opponentUsername, gameName] = modalId.split("_");
      if (!isGameName(gameName)) return;

      onClose({ gameData: { opponentUsername, gameName } });
    };

    return gameModals.map(modal => {
      const modalId = generateModalId(modal.gameData);
      const headerString = `Opponent: ${modal.gameData.opponentUsername}`;

      return (
        <CircleModal
          key={modalId}
          onClose={() => handleCloseGameModal(modalId)}
          headerString={headerString}
          addonCircleProps={getAddonCircleProps(
            modal.gameData.opponentUsername,
            modal.gameData.gameName
          )}
        >
          {getGameComponent(modal.gameData)}
        </CircleModal>
      );
    });
  }, [gameModals, games, iconMap, avatarMap, onClose]);

  return renderGameModals();
});
