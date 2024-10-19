import cls from "./Sidebar.module.scss";
import { cx } from "@/shared/lib";
import { useState } from "react";

import { ReactComponent as ArrowIcon } from "@/shared/assets/icons/arrow-bottom.svg";

import { UserList } from "@/features/UserList";
import { UserListProps } from "@/features/UserList";
import { AppSvg } from "@/shared/ui";

type SidebarProps = UserListProps;

export const Sidebar = ({ className, ...otherProps }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const onToggle = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <aside
      className={cx(cls.Sidebar, { [cls.collapsed]: collapsed }, [className])}
    >
      <UserList className={cls.items} collapsed={collapsed} {...otherProps} />

      <AppSvg
        className={cls.collapseBtn}
        onClick={onToggle}
        Svg={ArrowIcon}
        clickable
      />
    </aside>
  );
};
