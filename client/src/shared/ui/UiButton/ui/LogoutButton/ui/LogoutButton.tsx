import cls from "./LogoutButton.module.scss";
import { cx } from "@/shared/lib";
import { ButtonHTMLAttributes } from "react";

import { ReactComponent as LogoutSvg } from "@/shared/assets/icons/logout.svg";

import { AppSvg } from "@/shared/ui/AppSvg";

interface LogoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const LogoutButton = ({ className, onClick }: LogoutButtonProps) => {
  return (
    <button onClick={onClick} className={cx(cls.LogoutButton, {}, [className])}>
      <div className={cls.sign}>
        <AppSvg Svg={LogoutSvg} />
      </div>

      <div className={cls.text}>Logout</div>
    </button>
  );
};
