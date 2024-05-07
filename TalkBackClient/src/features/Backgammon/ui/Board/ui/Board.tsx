import { AppImage } from "@/shared/ui/AppImage";
import cls from "./Board.module.scss";
import { cx } from "@/shared/lib/cx";

export const Board = ({ className }: { className?: string }) => {
  const boardSrc = `${
    import.meta.env.VITE_GAME_SERVER_STATIC_URL
  }/game-background.jpeg`;

  return (
    <div className={cx(cls.Board, {}, [className])}>
      {" "}
      <AppImage
        className={cls.backgammonBoard}
        width={1200}
        height={800}
        src={boardSrc}
        draggable="false"
      ></AppImage>
    </div>
  );
};
