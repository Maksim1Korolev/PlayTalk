import {
  ImgHTMLAttributes,
  ReactElement,
  memo,
  useLayoutEffect,
  useState,
} from "react";

import { HighlightType, useHighlight } from "@/shared/hooks/useHighlight";
import { cx } from "@/shared/lib/cx";
import cls from "./AppImage.module.scss";

type ObjectFit = "cover" | "fill" | "contain" | "none";

type HTMLImageAttributes = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "width" | "height" | "onClick"
>;

interface AppImageBaseProps extends HTMLImageAttributes {
  className?: string;
  fallback?: ReactElement;
  errorFallback?: ReactElement;
  objectFit?: ObjectFit;
  highlight?: HighlightType;
  width?: number | string;
  height?: number | string;
}

interface ImageProps extends AppImageBaseProps {
  clickable?: false;
  onClick?: never;
}
interface ClickableImageProps extends AppImageBaseProps {
  clickable: true;
  onClick: () => void;
}

export type AppImageProps = ImageProps | ClickableImageProps;

export const AppImage = memo(
  ({
    className,
    src,
    alt = "image",
    fallback,
    highlight = "none",
    errorFallback,
    clickable = false,
    onClick,
    objectFit = "cover",
    width = 200,
    height = 200,
    ...otherProps
  }: AppImageProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useLayoutEffect(() => {
      const img = new Image();

      img.src = src ?? "";

      img.onload = () => {
        setIsLoading(false);
      };
      img.onerror = () => {
        setHasError(true);
      };
    }, [src]);

    const highlightClass = useHighlight(highlight);

    if (isLoading && fallback) {
      return fallback;
    }

    if (hasError && errorFallback) {
      return errorFallback;
    }

    const image = (
      <img
        className={cx("", { [highlightClass]: !!highlightClass }, [
          className,
          cls[objectFit],
        ])}
        alt={alt}
        src={src}
        width={width}
        height={height}
        {...otherProps}
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
          {image}
        </button>
      );
    }
    return image;
  }
);
