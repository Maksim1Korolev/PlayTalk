import { memo } from "react";
import cls from "./AppSvg.module.scss";
import { cx } from "@/shared/lib/cx";

export enum BackgroundType {
  STROKE = "stroke",
  FILL = "fill",
}

export enum BackgroundColor {
  SECONDARY_COLOR = "Secondary",
  PRIMARY_COLOR = "Primary",
}

interface AppSvgProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  backgroundType?: BackgroundType;
  backgroundColor?: BackgroundColor;
  pointer?: boolean;
}

export const AppSvg = memo(
  ({
    className,
    Svg,
    backgroundColor,
    backgroundType,
    pointer,
    ...otherProps
  }: AppSvgProps) => {
    const param = `${backgroundType}${backgroundColor}`;

    return (
      <Svg
        className={cx(cls[param], { [cls.pointer]: pointer }, [className])}
        {...otherProps}
      />
    );
  }
);
