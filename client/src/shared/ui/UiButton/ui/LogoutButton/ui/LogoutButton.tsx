import cls from "./LogoutButton.module.scss";

import { ButtonHTMLAttributes } from "react";

import { LogoutIcon, navbarResources } from "@/shared/assets";

import { cx } from "@/shared/lib";
import { AppSvg } from "@/shared/ui/AppSvg";
import { UiText } from "@/shared/ui/UiText";

interface LogoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}
export const LogoutButton = ({ className, onClick }: LogoutButtonProps) => {
  return (
    <button onClick={onClick} className={cx(cls.LogoutButton, {}, [className])}>
      <div className={cls.sign}>
        <AppSvg Svg={LogoutIcon} />
      </div>
      <UiText className={cls.text} bold>
        {navbarResources.button_logout}
      </UiText>
    </button>
  );
};
