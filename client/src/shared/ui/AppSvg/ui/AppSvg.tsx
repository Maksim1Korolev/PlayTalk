import { cx } from "@/shared/lib/cx";
import { forwardRef, HTMLAttributes, memo } from "react";
import cls from "./AppSvg.module.scss";

type SvgProps = Omit<React.SVGProps<SVGSVGElement>, "onClick" | "fill">;

interface SVGBaseProps extends SvgProps {
  className?: string;
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  backgroundColor?: BackgroundColor;
  fill?: boolean;
  highlighted?: boolean;
}

interface ImageSVGProps extends SVGBaseProps {
  clickable?: false;
  onClick?: never;
}
interface ClickableSVGProps extends SVGBaseProps {
  clickable: true;
  onClick: () => void;
}

export type SVGProps = ImageSVGProps | ClickableSVGProps;

type BackgroundColor = "white" | "black" | "primary";

export const AppSvg = forwardRef<SVGSVGElement, SVGProps>((props: SVGProps) => {
  const {
    className,
    ref,
    Svg,
    backgroundColor = "primary",
    width = 32,
    height = 32,
    clickable,
    fill,
    highlighted,
    onClick,
    ...otherProps
  } = props;

  const colorClass = `${fill ? "fill" : "stroke"}${
    backgroundColor.charAt(0).toUpperCase() + backgroundColor.slice(1)
  }`;

  const icon = (
    //Try to pass component the same way
    <Svg
      className={cx(
        cls.icon,
        { [cls.fill]: fill, [cls.highlighted]: highlighted },
        [colorClass]
      )}
      ref={ref}
      width={width}
      height={height}
      {...otherProps}
      onClick={undefined}
    />
  );

  if (clickable) {
    return (
      <button
        style={{ width, height }}
        type="button"
        className={cx(cls.button, {}, [className])}
        onClick={onClick}
      >
        {icon}
      </button>
    );
  }

  return icon;
});
