import {
  ImgHTMLAttributes,
  ReactElement,
  memo,
  useLayoutEffect,
  useState,
} from "react";

import { cx } from "@/shared/lib/cx";
import { HighlightType } from "../../AppSvg/ui/AppSvg";
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

//TODO:Relocate?
export const getAvatarPath = (avatar?: string) => {
  return avatar
    ? `${import.meta.env.VITE_S3_BUCKET_URL}/avatars/${avatar}`
    : "";
};

export const AppImage = memo(
  ({
    className,
    src,
    alt = "image",
    fallback,
    highlight,
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

    if (isLoading && fallback) {
      return fallback;
    }

    if (hasError && errorFallback) {
      return errorFallback;
    }

    const image = (
      <img
        className={cx(
          "",
          { [cls[`highlight-${highlight}`]]: highlight !== "none" },
          [className, cls[objectFit]]
        )}
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
