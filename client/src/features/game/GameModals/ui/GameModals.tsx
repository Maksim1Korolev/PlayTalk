import {
	memo,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react"
import { useCookies } from "react-cookie"

import { useAppSelector } from "@/shared/lib"
import { ModalContext } from "@/shared/lib/context/ModalContext"
import { AddonCircleProps, AppImage, CircleModal } from "@/shared/ui"
import { useModalPosition } from "@/shared/ui/CircleModal"
import getImagePath from "@/shared/utils/getImagePath"

import {
	Game,
	GameData,
	GameModal,
	isGameName,
	TicTacToeGame,
} from "@/entities/Game/model"
import { getUsers, User } from "@/entities/User"
import { TicTacToe } from "@/features/game/TicTacToe"
import { gameApiService } from "@/pages/OnlinePage/api/gameApiService"

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

  const users = useAppSelector(getUsers);

  const [games, setGames] = useState<{ [key: string]: Game }>({});
  const [iconMap, setIconMap] = useState<{ [key: string]: string }>({});
  const [avatarMap, setAvatarMap] = useState<{ [key: string]: string }>({});

  const { increaseModalCount, decreaseModalCount } = useContext(ModalContext);
  const { getStartingPosition } = useModalPosition();

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

        icons[gameName] = getImagePath({ collection:"gameIcons",fileName:gameName });

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

    const previousModalCountRef = useRef(gameModals.length);

    useEffect(() => {
      const previousCount = previousModalCountRef.current;
      const currentCount = gameModals.length;

      if (currentCount > previousCount) {
        increaseModalCount();
      } else if (currentCount < previousCount) {
        decreaseModalCount();
      }

      previousModalCountRef.current = currentCount;
    }, [gameModals.length]);

    const handleCloseGameModal = (modalId: string) => {
      const [opponentUsername, gameName] = modalId.split("_");
      if (!isGameName(gameName)) return;

      decreaseModalCount();
      onClose({ gameData: { opponentUsername, gameName } });
    };

    return gameModals.map(modal => {
      const modalId = generateModalId(modal.gameData);
      const headerString = `Opponent: ${modal.gameData.opponentUsername}`;

      const position = getStartingPosition();

      return (
        <CircleModal
          key={modalId}
          position={position}
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
