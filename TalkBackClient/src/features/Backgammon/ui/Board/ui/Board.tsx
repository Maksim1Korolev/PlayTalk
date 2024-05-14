import { useEffect, useState } from "react";
import { cx } from "@/shared/lib/cx";
import cls from "./Board.module.scss";
import { Point } from "../../Point";
import { HStack, VStack } from "@/shared/ui";

export const Board = ({ className }: { className?: string }) => {
  const boardSrc = `${
    import.meta.env.VITE_GAME_SERVER_STATIC_URL
  }/game-background.jpeg`;

  const backgroundImageStyle = {
    backgroundImage: `url(${boardSrc})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "70vw",
    height: "80vh",
  };

  const [points, setPoints] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const pointsArray = [];
    for (let i = 0; i < 24; i++) {
      pointsArray.push(<Point key={i} pointIndex={i} />);
    }
    setPoints(pointsArray);
  }, []);

  const firstHalf = points.slice(0, 12);
  const secondHalf = points.slice(12);

  return (
    <VStack
      className={cx(cls.Board, {}, [className])}
      style={backgroundImageStyle}
      justify="between"
    >
      <HStack max justify="between" isReverted>
        {firstHalf}
      </HStack>
      <HStack max justify="between">
        {secondHalf}
      </HStack>
    </VStack>
  );
};
