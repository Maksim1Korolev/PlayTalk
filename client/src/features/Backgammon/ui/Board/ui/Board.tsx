import { useEffect, useState } from "react";
import { cx } from "@/shared/lib/cx";
import cls from "./Board.module.scss";
import { Point } from "../../Point";
import { HStack, VStack } from "@/shared/ui";
import backgroundImageSrc from "@/features/Backgammon/assets/game-background.jpeg";

export const Board = ({ className }: { className?: string }) => {
  const backgroundImageStyle = {
    backgroundImage: `url(${backgroundImageSrc})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "70vw", // Board width
    height: "40vw", // Board height to maintain a 7:4 aspect ratio
    maxWidth: "1000px", // Maximum width to ensure it doesn't get too large
    maxHeight: "600px", // Maximum height to ensure it doesn't get too large
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
