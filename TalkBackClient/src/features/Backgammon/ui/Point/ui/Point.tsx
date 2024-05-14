import { AppSvg } from "@/shared/ui/";
import cls from "./Point.module.scss";
import { cx } from "@/shared/lib/cx";
import { memo } from "react";

export interface PointProps {
  className?: string;
  pointIndex: number;
}

export const Point = memo(({ className, pointIndex }: PointProps) => {
  const pointSrc = `${
    import.meta.env.VITE_GAME_SERVER_STATIC_URL
  }/hollow-point.svg`;

  return (
    <div className={cx(cls.Point, {}, [className])}>
      <AppSvg className={cls.hollowPoint} src={pointSrc}></AppSvg>
    </div>
  );
});
