import { cx } from "@/shared/lib/cx";
import { AppSvg, SVGProps } from "@/shared/ui";
import { memo } from "react";
import { AppImage, AppImageProps } from "../../AppImage";
import cls from "./AddonCircle.module.scss";

export type AddonCircleIconProps = SVGProps | AppImageProps;

export type AddonCircleProps = {
  className?: string;
  iconProps: AddonCircleIconProps;
  addonTopRight?: React.ReactNode;
  addonBottomRight?: React.ReactNode;
  addonTopLeft?: React.ReactNode;
  addonBottomLeft?: React.ReactNode;
  onClick?: () => void;
};

export const AddonCircle = memo(
  ({
    className,
    iconProps,
    addonTopRight,
    addonBottomRight,
    addonTopLeft,
    addonBottomLeft,
    onClick,
  }: AddonCircleProps) => {
    const handleIconClicked = () => {
      if (onClick) {
        onClick();
      }
      return;
    };
    const appIcon =
      "Svg" in iconProps ? (
        <AppSvg
          {...(iconProps as SVGProps)} // Render AppSvg if the `Svg` property exists
          clickable
          onClick={handleIconClicked}
          ref={undefined}
        />
      ) : (
        <AppImage {...iconProps} clickable onClick={handleIconClicked} />
      );

    return (
      <div className={cx(cls.AddonCircle, {}, [className])}>
        <div className={cls.appIcon}>{appIcon}</div>
        <div className={cls.addonTopRight}>{addonTopRight}</div>
        <div className={cls.addonBottomRight}>{addonBottomRight}</div>
        <div className={cls.addonTopLeft}>{addonTopLeft}</div>
        <div className={cls.addonBottomLeft}>{addonBottomLeft}</div>
      </div>
    );
  }
);
