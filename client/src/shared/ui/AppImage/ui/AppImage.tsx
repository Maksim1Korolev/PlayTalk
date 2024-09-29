import {
  ImgHTMLAttributes,
  ReactElement,
  memo,
  useLayoutEffect,
  useState,
} from "react";

import { cx } from "@/shared/lib/cx";
import cls from "./AppImage.module.scss";

type ObjectFit = "cover" | "fill" | "contain" | "none";

type HTMLImageAttributes = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "width" | "height"
>;

export interface AppImageProps extends HTMLImageAttributes {
  className?: string;
  fallback?: ReactElement;
  errorFallback?: ReactElement;
  objectFit?: ObjectFit;
  width?: number | string;
  height?: number | string;
}

//TODO:Relocate?
export const getAvatarPath = (avatar?: string) => {
  return avatar
    ? `${import.meta.env.VITE_AUTH_SERVICE_STATIC_URL}/avatars${avatar}`
    : "";
};

export const AppImage = memo(
  ({
    className,
    src,
    alt = "image",
    fallback,
    errorFallback,
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

    return (
      <img
        className={cx("", {}, [className, cls[objectFit]])}
        alt={alt}
        src={src}
        width={width}
        height={height}
        {...otherProps}
      />
    );
  }
);
