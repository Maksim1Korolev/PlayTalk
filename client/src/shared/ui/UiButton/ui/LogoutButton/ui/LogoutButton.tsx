import cls from "./LogoutButton.module.scss";

import { ButtonHTMLAttributes } from "react";

import { LogoutIcon } from "@/shared/assets";

import { cx } from "@/shared/lib";
import { AppSvg } from "@/shared/ui/AppSvg";

interface LogoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const LogoutButton = ({ className, onClick }: LogoutButtonProps) => {
  return (
    <button onClick={onClick} className={cx(cls.LogoutButton, {}, [className])}>
      <div className={cls.sign}>
        <AppSvg Svg={LogoutIcon} />
      </div>

      <div className={cls.text}>Logout</div>
    </button>
  );
};
