import { memo } from "react";
import cls from "./AppSvg.module.scss";
import { cx } from "@/shared/lib/cx";

type BackgroundType = "stroke" | "fill";

type BackgroundColor = "white" | "black" | "primary";

type AppSvgProps = React.SVGProps<SVGSVGElement> & {
  className?: string;
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  backgroundType?: BackgroundType;
  backgroundColor?: BackgroundColor;
  pointer?: boolean;
};

export const AppSvg = memo(
  ({
    className,
    Svg,
    backgroundColor = "black",
    backgroundType = "fill",
    pointer,
    ...otherProps
  }: AppSvgProps) => {
    const param = `${backgroundType}${
      backgroundColor.charAt(0).toUpperCase() + backgroundColor.slice(1)
    }`;

    return (
      <Svg
        className={cx(cls[param], { [cls.pointer]: pointer }, [className])}
        {...otherProps}
      />
    );
  }
);
