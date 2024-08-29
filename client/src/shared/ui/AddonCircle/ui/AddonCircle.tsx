import { memo } from "react";
import cls from "./AddonCircle.module.scss";
import { cx } from "@/shared/lib/cx";
import { AppImage } from "@/shared/ui/";

interface AddonCircleBaseProps {
  className?: string;
  imgSrc: string;
  size?: number;
  addonTopRight?: React.ReactNode;
  addonBottomRight?: React.ReactNode;
  addonTopLeft?: React.ReactNode;
  addonBottomLeft?: React.ReactNode;
  onClick: () => void;
}

interface ImageProps extends AddonCircleBaseProps {
  clickable?: false;
}

interface ClickableImageProps extends AddonCircleBaseProps {
  clickable: true;
  onClick: () => void;
}

export type AddonCircleProps = ImageProps | ClickableImageProps;

const defaultImage = "images/default-avatar.svg";

export const AddonCircle = memo(
  ({
    className,
    imgSrc,
    size = 80,
    clickable,
    onClick,
    addonTopRight,
    addonBottomRight,
    addonTopLeft,
    addonBottomLeft,
  }: AddonCircleProps) => {
    const getDefaultImage = () => {
      return (
        <AppImage
          className={cls.mainImage}
          width={size}
          height={size}
          src={defaultImage}
          //draggable false? has been in two places
          draggable="false"
        />
      );
    };

    //Change to svg?
    const circle = (
      <div className={cx(cls.AddonCircle, {}, [className])}>
        <AppImage
          className={cx(cls.mainImage, {}, [className])}
          width={size}
          height={size}
          src={imgSrc}
          onClick={onClick}
          errorFallback={getDefaultImage()}
        />
        <div className={cls.addonTopRight}>{addonTopRight}</div>
        <div className={cls.addonBottomRight}>{addonBottomRight}</div>
        <div className={cls.addonTopLeft}>{addonTopLeft}</div>
        <div className={cls.addonBottomLeft}>{addonBottomLeft}</div>
      </div>
    );

    if (!clickable) {
      return circle;
    }

    return (
      <button
        style={{ width: size, height: size }}
        type="button"
        className={cx(cls.button, {}, [className])}
        onClick={onClick}
      >
        {circle}
      </button>
    );
  }
);
