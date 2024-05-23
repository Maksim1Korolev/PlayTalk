import cls from "./Point.module.scss";
import { cx } from "@/shared/lib/cx";
import { memo } from "react";
import { ReactComponent as HollowPoint } from "@/features/Backgammon/assets/svg/hollow-point.svg";
import { AppSvg } from "@/shared/ui";
import { BackgroundColor, BackgroundType } from "@/shared/ui/AppSvg/ui/AppSvg";

export interface PointProps {
  className?: string;
  pointIndex: number;
}

export const Point = memo(({ className, pointIndex }: PointProps) => {
  return (
    <div className={cx(cls.Point, {}, [className])}>
      <AppSvg
        className={cls.hollowPoint}
        Svg={HollowPoint}
        backgroundColor={BackgroundColor.PRIMARY_COLOR}
        backgroundType={BackgroundType.FILL}
      />
    </div>
  );
});
