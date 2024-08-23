import { memo, useState } from "react";
import cls from "./Box.module.scss";
import { cx } from "@/shared/lib/cx";
import { UiButton } from "@/shared/ui";

interface BoxProps {
  className?: string;
  index: number;
  sign: "-" | "O" | "X";
  playerSign: "O" | "X";
  isActiveTurn: boolean;
  onMakeMove: ({ interactingIndex }: { interactingIndex: number }) => void;
}

export const Box = memo(
  ({
    className,
    index,
    sign,
    playerSign,
    onMakeMove,
    isActiveTurn,
  }: BoxProps) => {
    const [currentSign, setCurrentSign] = useState(sign);

    const handleBoxClicked = () => {
      if (isActiveTurn && currentSign === "-") {
        setCurrentSign(playerSign);
        onMakeMove({ interactingIndex: index });
      }
    };

    return (
      <UiButton
        className={cx(cls.TicTacToeBox, {}, [className])}
        onClick={handleBoxClicked}
      >
        <div>{currentSign}</div>
      </UiButton>
    );
  }
);
