import { memo, useEffect, useState } from "react";
import cls from "./GameModals.module.scss";
import { cx } from "@/shared/lib/cx";
import { gameApiService } from "@/pages/OnlinePage/api/gameApiService";
import { useCookies } from "react-cookie";
import { User } from "@/entities/User";
import { TicTacToe } from "@/features/game/TicTacToe/";
import { GameModalStateProps } from "@/entities/Game/model/types/gameModalStateProps";
import { AddonCircleProps, CircleModal, SVGProps } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

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
    const currentUser: User = cookies["jwt-cookie"]?.user;
    const [games, setGames] = useState<{ [key: string]: any }>({});
    const [iconSvgMap, setIconSvgMap] = useState<{
      [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    }>({});

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

        for (const modal of gameModals) {
          const { gameName } = modal;
          const iconPath = getImagePath({ gameName });

          try {
            const importedIcon = await import(iconPath);
            iconMap[gameName] = importedIcon.ReactComponent;
          } catch (error) {
            console.error(`Failed to load icon for game: ${gameName}`, error);
          }
        }

        setIconSvgMap(iconMap);
      };

      loadIcons();
    }, [gameModals]);

    const handleCloseGameModal = (modalId: string) => {
      const [opponentUsername, gameName] = modalId.split("_");

      onClose({ opponentUsername, gameName });
    };

    const getGameComponent = (opponentUsername: string, gameName: string) => {
      const gameId = generateModalId(opponentUsername, gameName);
      const game = games[gameId];

      if (!game) return null;

      switch (gameName) {
        case "tic-tac-toe":
          return <TicTacToe key={gameId} game={game} />;
        default:
          return <div>No game found</div>;
      }
    };

    const getAddonCircleProps = (currentGameName: string): AddonCircleProps => {
      const gameIconProps = getGameIconProps(currentGameName);

      const addonCircleProps: AddonCircleProps = {
        iconProps: gameIconProps,
        addonTopRight: <div>tr</div>,
      };

      return addonCircleProps;
    };

    const getGameIconProps = (currentGameName: string): SVGProps => {
      const size = 80;
      const highlighted = true;
      const SvgComponent = iconSvgMap[currentGameName];

      const svgProps: SVGProps = {
        Svg: SvgComponent,
        width: size,
        height: size,
        highlighted,
      };

      return svgProps;
    };

    return (
      <div className={cx(cls.GameModals, {}, [className])}>
        {gameModals.map(modal => {
          const modalId = generateModalId(
            modal.opponentUsername,
            modal.gameName
          );
          return (
            <CircleModal
              key={modalId}
              onClose={() => handleCloseGameModal(modalId)}
              headerString={modal.opponentUsername}
              addonCircleProps={getAddonCircleProps(modal.gameName)}
            >
              {getGameComponent(modal.opponentUsername, modal.gameName)}
            </CircleModal>
          );
        })}
      </div>
    );
  }
);
