import cls from "./PlayButton.module.scss"

import { useEffect, useRef, useState } from "react"
import { CircleMenu, CircleMenuItem } from "react-circular-menu"
import ReactDOM from "react-dom"

import { useAppDispatch, useAppSelector } from "@/shared/lib"
import { cx } from "@/shared/lib/className/cx"
import { HighlightType, useHighlight } from "@/shared/lib/hooks/useHighlight"
import { AppImage } from "@/shared/ui"
import getImagePath from "@/shared/utils/getImagePath"

import { GameName, GameNames } from "@/entities/game/Game"
import { circleMenuActions } from "@/features/UserList"
import { selectActiveMenuId } from "@/features/UserList/model/selectors/selectActiveMenuId"

interface PlayButtonProps {
  className?: string;
  highlight?: HighlightType;
  onSelectGame: (gameName: GameName) => void;
  menuId: string; // unique identifier for each CircleMenu instance
}

export const PlayButton = ({
  className,
  highlight = "none",
  onSelectGame,
  menuId,
}: PlayButtonProps) => {
  const gameNames = Object.values(GameNames);
  const highlightClass = useHighlight(highlight);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [animateOpen, setAnimateOpen] = useState(false); // Animation control state
  const [isFlipped, setIsFlipped] = useState(false); // Flip animation state
  const playButtonRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const activeMenuId = useAppSelector(selectActiveMenuId);
  const isSelectorOpen = activeMenuId === menuId;

  const handleMenuToggle = () => {
    if (isSelectorOpen) {
      // Flip back when closing
      setIsFlipped(false);
      setTimeout(() => {
        dispatch(circleMenuActions.closeMenu());
        setAnimateOpen(false);
        setShowMenu(false);
      }, 100); // Wait for closing animation to finish
    } else {
      dispatch(circleMenuActions.closeMenu()); // Close any other open menu before opening the current one
      const rect = playButtonRef.current?.getBoundingClientRect();
      if (rect) {
        setMenuPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
      setShowMenu(true);
      setTimeout(() => {
        setIsFlipped(true); // Flip forward when opening
        setAnimateOpen(true);
        dispatch(circleMenuActions.openMenu(menuId));
      }, 50); // Small delay to trigger animation
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

  const playButtonSrc = getImagePath({
    collection: "appIcons",
    fileName: "play",
  });

  // Custom Toggle Element for CircleMenu
  const CustomToggleElement = (
    <div
      className={cx(cls.customToggle, {
        [cls.active]: isSelectorOpen,
        [cls.flipped]: isFlipped,
      })}
      onClick={handleMenuToggle}
    >
      <AppImage
        className={cls.playIcon}
        width={50}
        height={50}
        src={"../../../../../../../public/play-icon.svg"}
        draggable={false}
        clickable
        onClick={handleMenuToggle}
      />
    </div>
  );

  return (
    <>
      <div ref={playButtonRef}>{CustomToggleElement}</div>
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
              rotationAngle={50}
              itemSize={1.5}
              radius={3.2}
              open={animateOpen}
              onMenuToggle={handleMenuToggle}
              menuToggleElement={CustomToggleElement} // Pass the custom toggle element to CircleMenu

            >
              {gameNames.map(gameName => {
                const gameSrc = getImagePath({
                  collection: "gameIcons",
                  fileName: gameName,
                });
                return (
                  <CircleMenuItem
										className={cls.circleMenuItem}
                    key={gameName}
                    tooltip={gameName}
                    onClick={() => onSelectGame(gameName)}
                  >
                    <AppImage
                      src={gameSrc}
                      width={40}
                      height={40}
                      draggable={false}
                      alt=""
                      className={cx(cls.PlayButton, {
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
