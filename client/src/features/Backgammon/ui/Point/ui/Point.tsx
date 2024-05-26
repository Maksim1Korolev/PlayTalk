import cls from "./Point.module.scss";
import { cx } from "@/shared/lib/cx";
import { memo } from "react";
import { ReactComponent as FilledPoint } from "@/features/Backgammon/assets/svg/filled-point.svg";
import { AppSvg } from "@/shared/ui";

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
        backgroundType="fill"
      />
    </div>
  );
});
