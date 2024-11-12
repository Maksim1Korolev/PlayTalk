import cls from "./GameSelector.module.scss";

import { useEffect, useRef, useState } from "react";
import { CircleMenu, CircleMenuItem } from "react-circular-menu";
import ReactDOM from "react-dom";

import {
  cx,
  HighlightType,
  useAppDispatch,
  useAppSelector,
  useHighlight,
} from "@/shared/lib";
import { AppImage } from "@/shared/ui";
import getImagePath from "@/shared/utils/getImagePath";

import { GameData, GameName, GameNames } from "@/entities/game/Game";
import { circleMenuActions, selectActiveMenuId } from "@/features/UserList";

interface GameSelectorProps {
  className?: string;
  menuId: string;
  onGameClicked: ({ gameName }: { gameName: GameName }) => void;
}

export const GameSelector = ({
  className,
  menuId,
  onGameClicked: onGameSelected,
}: GameSelectorProps) => {
  const gameNames = Object.values(GameNames);

  const highlightClass = useHighlight("secondary");

  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [animateOpen, setAnimateOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const playButtonRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const activeMenuId = useAppSelector(selectActiveMenuId);
  const isSelectorOpen = activeMenuId === menuId;

  const handleMenuToggle = () => {
    if (isSelectorOpen) {
      setIsFlipped(false);
      setTimeout(() => {
        dispatch(circleMenuActions.closeMenu());
        setAnimateOpen(false);
        setShowMenu(false);
      }, 100);
    } else {
      dispatch(circleMenuActions.closeMenu());
      const rect = playButtonRef.current?.getBoundingClientRect();
      if (rect) {
        setMenuPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
      setShowMenu(true);
      setTimeout(() => {
        setIsFlipped(true);
        setAnimateOpen(true);
        dispatch(circleMenuActions.openMenu(menuId));
      }, 50);
    }
  };

  useEffect(() => {
    if (!isSelectorOpen) {
      setIsFlipped(false);
      setTimeout(() => {
        setAnimateOpen(false);
        setShowMenu(false);
      }, 100);
    }
  }, [isSelectorOpen]);

  const handleGameClicked = (gameName: GameName) => {
    if (!gameName) return;

    onGameSelected({ gameName });
    handleMenuToggle();
  };

  // const onGameClicked = (gameName: GameName) => {
  //   if (handlePlayButton && user) {
  //     handlePlayButton({
  //       gameData: {
  //         gameName,
  //         opponentUsername: user.username,
  //       },
  //       isInviting: user.isInviting || false,
  //       isActive: user.activeGames?.includes(gameName) || false,
  //     });
  //   }
  // };

  const playButtonSrc = getImagePath({
    collection: "appIcons",
    fileName: "play",
  });

  const CustomToggleElement = (
    <div
      className={cx(cls.customToggle, {
        [cls.flipped]: isFlipped,
      })}
      onClick={handleMenuToggle}
    >
      <AppImage
        className={cls.playIcon}
        width={60}
        height={60}
        src={playButtonSrc}
        draggable={false}
      />
    </div>
  );

  return (
    <>
      <div ref={playButtonRef} className={className}>
        {CustomToggleElement}
      </div>
      {showMenu &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 250,
            }}
          >
            <CircleMenu
              startAngle={-90}
              rotationAngle={60}
              itemSize={1.5}
              radius={3.2}
              open={animateOpen}
              onMenuToggle={handleMenuToggle}
              menuToggleElement={CustomToggleElement}
            >
              {gameNames.map((gameName) => {
                const gameSrc = getImagePath({
                  collection: "gameIcons",
                  fileName: gameName,
                });
                return (
                  <CircleMenuItem
                    className={cls.circleMenuItem}
                    key={gameName}
                    tooltip={gameName}
                    onClick={() => handleGameClicked(gameName)}
                  >
                    <AppImage
                      src={gameSrc}
                      width={60}
                      height={60}
                      draggable={false}
                      alt=""
                      className={cx(cls.gameIcon, {
                        [highlightClass]: !!highlightClass,
                      })}
                    />
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
