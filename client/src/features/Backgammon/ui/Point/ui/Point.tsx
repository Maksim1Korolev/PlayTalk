import { ReactComponent as FilledPoint } from "@/features/Backgammon/assets/svg/filled-point.svg";
import { cx } from "@/shared/lib/cx";
import { AppSvg } from "@/shared/ui";
import { memo } from "react";
import cls from "./Point.module.scss";

type PointProps = {
  className?: string;
  pointIndex: number;
};

export const Point = memo(({ className, pointIndex }: PointProps) => {
  const backgroundColor = pointIndex % 2 === 0 ? "white" : "primary";

  return (
    <div className={cx(cls.Point, {}, [className])}>
      <AppSvg
        className={cls.hollowPoint}
        Svg={FilledPoint}
        backgroundColor={backgroundColor}
        fill
      />
    </div>
  );
});
