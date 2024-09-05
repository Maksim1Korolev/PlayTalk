import { memo } from "react";
import cls from "./AddonCircle.module.scss";
import { cx } from "@/shared/lib/cx";
import { SVGProps, AppSvg } from "@/shared/ui";

export type AddonCircleProps = {
  className?: string;
  iconProps: SVGProps;
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
    const appIcon = (
      <AppSvg
        {...iconProps}
        clickable
        onClick={handleIconClicked}
        ref={undefined}
      />
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
