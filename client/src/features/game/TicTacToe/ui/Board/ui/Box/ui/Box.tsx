import { memo } from "react";
import cls from "./Box.module.scss";
import { cx } from "@/shared/lib/cx";
import { UiButton } from "@/shared/ui";

interface BoxProps {
  className?: string;
  index: number;
  sign: "-" | "O" | "X";
  onMakeMove: ({ interactingIndex }: { interactingIndex: number }) => void;
}

export const Box = memo(({ className, index, sign, onMakeMove }: BoxProps) => {
  const handleBoxClicked = () => {
    onMakeMove({ interactingIndex: index });
  };

  return (
    <UiButton
      className={cx(cls.TicTacToeBox, {}, [className])}
      onClick={handleBoxClicked}
    >
      {sign}
    </UiButton>
  );
});
