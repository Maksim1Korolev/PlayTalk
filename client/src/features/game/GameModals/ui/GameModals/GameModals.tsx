import {
  Game,
  GameModalStateProps,
  TicTacToeGame,
} from "@/entities/Game/model/";
import { TicTacToe } from "@/features/game/TicTacToe/";
import { HighlightType } from "@/features/UserList/ui/PlayButton";
import { gameApiService } from "@/pages/OnlinePage/api/gameApiService";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { cx } from "@/shared/lib/cx";
import { AddonCircleProps, AppSvg, CircleModal, SVGProps } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";
import { memo, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import cls from "./GameModals.module.scss";

const generateModalId = (
  opponentUsername: string,
  gameName: string
): string => {
  return `${opponentUsername}_${gameName}`;
};

interface GameModalsProps {
  className?: string;
  gameModals: GameModalStateProps[];
  onClose: ({
    opponentUsername,
    gameName,
  }: {
    opponentUsername: string;
    gameName: string;
  }) => void;
}

export const GameModals = memo(
  ({ className, gameModals, onClose }: GameModalsProps) => {
    const [cookies] = useCookies(["jwt-cookie"]);
    const { user: currentUser, token } = cookies["jwt-cookie"];

    const { users } = useContext(UsersContext);

    const [games, setGames] = useState<{ [key: string]: Game }>({});

    const [iconSvgMap, setIconSvgMap] = useState<{
      [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    }>({});

    const [avatarIconMap, setAvatarIconMap] = useState<{
      [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    }>({});

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
        const iconMap: {
          [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        } = {};
        const avatarMap: {
          [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        } = {};

        for (const modal of gameModals) {
          const { gameName, opponentUsername } = modal;

          const iconPath = getImagePath({ gameName });
          try {
            const importedIcon = await import(iconPath);
            iconMap[gameName] = importedIcon.ReactComponent;
          } catch (error) {
            console.error(`Failed to load icon for game: ${gameName}`, error);
          }

          const opponentUser = users.find(
            user => user.username === opponentUsername
          );
          const avatarPath = getImagePath({
            avatarFileName: opponentUser?.avatarFileName,
          });

          try {
            const importedAvatar = await import(avatarPath);
            avatarMap[opponentUsername] = importedAvatar.ReactComponent;
          } catch (error) {
            console.error(
              `Failed to load avatar for user: ${opponentUsername}`,
              error
            );
          }
        }

        setIconSvgMap(iconMap);
        setAvatarIconMap(avatarMap);
      };

      loadIcons();
    }, [gameModals, users]);

    const handleCloseGameModal = (modalId: string) => {
      const [opponentUsername, gameName] = modalId.split("_");

      onClose({ opponentUsername, gameName });
    };

    const getGameComponent = (opponentUsername: string, gameName: string) => {
      const gameId: string = generateModalId(opponentUsername, gameName);
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
      const gameIconProps = getGameIconProps(currentGameName);
      const addonTopRight = getAvatarIcon(opponentUsername);

      const addonCircleProps: AddonCircleProps = {
        iconProps: gameIconProps,
        addonTopRight,
      };

      return addonCircleProps;
    };

    const getGameIconProps = (currentGameName: string): SVGProps => {
      const size = 80;
      const highlight: HighlightType = "primary";
      const SvgComponent = iconSvgMap[currentGameName];

      const svgProps: SVGProps = {
        Svg: SvgComponent,
        width: size,
        height: size,
        highlight,
      };

      return svgProps;
    };

    const getAvatarIcon = (opponentUsername: string): React.ReactNode => {
      const SvgComponent = avatarIconMap[opponentUsername];

      if (!SvgComponent) return null;

      const svgProps: SVGProps = {
        Svg: SvgComponent,
      };

      return <AppSvg {...svgProps} ref={undefined} />;
    };

    return (
      <div className={cx(cls.GameModals, {}, [className])}>
        {gameModals.map(modal => {
          const modalId = generateModalId(
            modal.opponentUsername,
            modal.gameName
          );
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
        })}
      </div>
    );
  }
);
