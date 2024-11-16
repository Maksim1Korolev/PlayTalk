import cls from "./GameSelector.module.scss";

import { useEffect, useMemo, useRef, useState } from "react";
import { CircleMenu, CircleMenuItem } from "react-circular-menu";
import ReactDOM from "react-dom";

import {
  cx,
  getHighlightClass,
  HighlightType,
  useAppDispatch,
  useAppSelector,
} from "@/shared/lib";
import { AppImage } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import { GameName, GameNames } from "@/entities/game/Game";
import { GameStatus } from "@/entities/game/GameStatus";
import { circleMenuActions, selectActiveMenuId } from "@/features/UserList";

interface GameSelectorProps {
  className?: string;
  menuId: string;
  userGameStatusMap?: Partial<Record<GameName, GameStatus>>;
  size?: number;
  onGameClicked: ({ gameName }: { gameName: GameName }) => void;
}

export const GameSelector = ({
  className,
  menuId,
  userGameStatusMap,
  size = 60,
  onGameClicked,
}: GameSelectorProps) => {
  const gameNames = Object.values(GameNames);

  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [animateOpen, setAnimateOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const playButtonRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const activeMenuId = useAppSelector(selectActiveMenuId);
  const isSelectorOpen = activeMenuId === menuId;

  const menuItemSize = 60;

  const handleMenuToggle = () => {
    if (isSelectorOpen) {
      setIsFlipped(false);
      setTimeout(() => {
        dispatch(circleMenuActions.closeMenu());
        setAnimateOpen(false);
        setShowMenu(false);
      }, 200);
    } else {
      dispatch(circleMenuActions.closeMenu());

      setShowMenu(true);
      setTimeout(() => {
        setIsFlipped(true);
        setAnimateOpen(true);
        dispatch(circleMenuActions.openMenu(menuId));
      }, 200);
    }
  };

  //Resize check
  useEffect(() => {
    const updateMenuPosition = () => {
      const rect = playButtonRef.current?.getBoundingClientRect();
      if (rect) {
        setMenuPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    };

    updateMenuPosition();

    window.addEventListener("resize", updateMenuPosition);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [playButtonRef]);

  const playButtonHighlightType: HighlightType = useMemo(() => {
    const hasInvitation = Object.values(userGameStatusMap || {}).some(
      (status) => status.hasInvitation
    );
    const isActive = Object.values(userGameStatusMap || {}).some(
      (status) => status.isActive
    );

    if (isActive) {
      return "active";
    } else if (hasInvitation) {
      return "invited";
    } else {
      return "none";
    }
  }, [userGameStatusMap]);

  const playButtonHighlightClass = getHighlightClass(playButtonHighlightType);

  const handleGameClicked = (gameName: GameName) => {
    if (!gameName) return;

    onGameClicked({ gameName });
    handleMenuToggle();
  };

  const playButtonSrc = getImagePath({
    collection: "appIcons",
    fileName: "play",
  });

  const CustomToggleElement = (
    <div
      className={cx(cls.playButtonBorder, {
        [cls.flipped]: isFlipped,
      })}
    >
      <div className={cx(cls.customToggle)} onClick={handleMenuToggle}>
        <AppImage
          className={cx(cls.playIcon)}
          width={size}
          height={size}
          src={playButtonSrc}
          draggable={false}
        />
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cx(cls.playButton, {
          [playButtonHighlightClass]: !!playButtonHighlightClass,
        })}
      >
        <div ref={playButtonRef}>{CustomToggleElement}</div>
      </div>
      {showMenu &&
        ReactDOM.createPortal(
          <div
            className={className}
            style={{
              position: "absolute",
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 250,
            }}
          >
            <CircleMenu
              startAngle={-90}
              rotationAngle={90}
              itemSize={2}
              radius={5}
              open={animateOpen}
              onMenuToggle={handleMenuToggle}
              menuToggleElement={CustomToggleElement}
            >
              {gameNames.map((gameName) => {
                const gameStatus = userGameStatusMap?.[gameName];
                const isActive = gameStatus?.isActive;
                const hasInvitation = gameStatus?.hasInvitation;

                let iconHighlightType: HighlightType = "none";
                if (isActive) {
                  iconHighlightType = "active";
                } else if (hasInvitation) {
                  iconHighlightType = "invited";
                }

                const iconHighlightClass = getHighlightClass(iconHighlightType);

                const gameSrc = getImagePath({
                  collection: "gameIcons",
                  fileName: gameName,
                });

                return (
                  <CircleMenuItem
                    className={cx(cls.circleMenuItem)}
                    key={gameName}
                    tooltip={gameName}
                    onClick={() => {
                      if (isFlipped) {
                        handleGameClicked(gameName);
                      }
                    }}
                  >
                    <div
                      className={cx(cls.gameIconBorder, {
                        [iconHighlightClass]: !!iconHighlightClass,
                      })}
                    >
                      <AppImage
                        src={gameSrc}
                        width={menuItemSize}
                        height={menuItemSize}
                        draggable={false}
                        alt=""
                        className={cx(cls.gameIcon, {})}
                      />
                    </div>
                  </CircleMenuItem>
                );
              })}
            </CircleMenu>
          </div>,
          document.body
        )}
    </>
  );
};
