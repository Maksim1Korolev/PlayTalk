import cls from "./Sidebar.module.scss";

import { useState } from "react";

import { VArrowIcon } from "@/shared/assets";

import { cx } from "@/shared/lib";
import { AppSvg } from "@/shared/ui";

import { UserList, UserListProps } from "@/features/UserList";

type SidebarProps = UserListProps;

export const Sidebar = ({ className, ...otherProps }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const onToggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={cx(cls.Sidebar, { [cls.collapsed]: collapsed }, [className])}
    >
      <UserList className={cls.items} collapsed={collapsed} {...otherProps} />
      <AppSvg
        className={cls.collapseBtn}
        onClick={onToggle}
        Svg={VArrowIcon}
        clickable
      />
    </aside>
  );
};
