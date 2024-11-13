import cls from "./AddonCircle.module.scss";

import { memo } from "react";

import { cx } from "@/shared/lib";
import { AppImage, AppImageProps, AppSvg, SVGProps } from "@/shared/ui";

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
  }: AddonCircleProps) => {
    const appIcon =
      "Svg" in iconProps ? (
        <AppSvg {...(iconProps as SVGProps)} ref={undefined} />
      ) : (
        <AppImage {...iconProps} />
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
