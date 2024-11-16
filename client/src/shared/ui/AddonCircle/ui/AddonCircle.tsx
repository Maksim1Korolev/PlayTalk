import cls from "./AddonCircle.module.scss";

import { memo, ReactNode } from "react";

import { cx } from "@/shared/lib";
import { AppImageProps, SVGProps } from "@/shared/ui";

export type AddonCircleIconProps = SVGProps | AppImageProps;

export type AddonCircleProps = {
  className?: string;
  children: ReactNode;
  addonTopRight?: React.ReactNode;
  addonBottomRight?: React.ReactNode;
  addonTopLeft?: React.ReactNode;
  addonBottomLeft?: React.ReactNode;
  onClick?: () => void;
};

export const AddonCircle = memo(
  ({
    className,
    children,
    addonTopRight,
    addonBottomRight,
    addonTopLeft,
    addonBottomLeft,
  }: AddonCircleProps) => {
    //const appIcon =
    //  "Svg" in iconProps ? (
    //    <AppSvg {...(iconProps as SVGProps)} ref={undefined} />
    //  ) : (
    //    <AppImage {...iconProps} />
    //  );

    return (
      <div className={cx(cls.AddonCircle, {}, [className])}>
        <div className={cls.appIcon}>{children}</div>
        <div className={cls.addonTopRight}>{addonTopRight}</div>
        <div className={cls.addonBottomRight}>{addonBottomRight}</div>
        <div className={cls.addonTopLeft}>{addonTopLeft}</div>
        <div className={cls.addonBottomLeft}>{addonBottomLeft}</div>
      </div>
    );
  }
);
