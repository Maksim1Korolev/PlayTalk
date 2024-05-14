import cls from "./AppSvg.module.scss";
import { cx } from "@/shared/lib/cx";

export const AppSvg = ({
  className,
  src,
}: {
  className?: string;
  src: string;
}) => {
  return (
    <img
      className={cx("", {}, [className])}
      src={src}
      alt="Description of SVG"
    />
  );
};
