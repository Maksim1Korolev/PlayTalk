import cls from "./Square.module.scss";
import { cx } from "@/shared/lib";
import { memo } from "react";

import { UiButton } from "@/shared/ui";

interface SquareProps {
  className?: string;
  index: number;
  sign: "-" | "O" | "X";
  onMakeMove: ({ interactingIndex }: { interactingIndex: number }) => void;
}

export const Square = memo(
  ({ className, index, sign, onMakeMove }: SquareProps) => {
    const handleSquareClicked = () => {
      onMakeMove({ interactingIndex: index });
    };

    return (
      <UiButton
        className={cx(cls.Square, {}, [className])}
        onClick={handleSquareClicked}
      >
        {sign}
      </UiButton>
    );
  }
);
