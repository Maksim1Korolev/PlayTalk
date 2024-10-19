import cls from "./Navbar.module.scss";
import { cx } from "@/shared/lib";
import { memo } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { LogoutButton } from "@/shared/ui/UiButton";
import { HStack } from "@/shared/ui";

export const Navbar = memo(({ className }: { className?: string }) => {
  const [cookie, , removeCookie] = useCookies(["jwt-cookie"]);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie("jwt-cookie");
    navigate("/auth");
  };

  return (
    <HStack max align="end" className={cx(cls.Navbar, {}, [className])}>
      {cookie["jwt-cookie"] && (
        <LogoutButton className={cls.logout} onClick={handleLogout} />
      )}
    </HStack>
  );
});
