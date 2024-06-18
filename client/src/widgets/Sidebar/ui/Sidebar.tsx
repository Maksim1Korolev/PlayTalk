import { UserList } from "@/features/UserList";
import { UserListProps } from "@/features/UserList/ui/UserList";
import { ReactComponent as ArrowIcon } from "@/shared/assets/icons/arrow-bottom.svg";
import { cx } from "@/shared/lib/cx";
import { AppSvg } from "@/shared/ui";
import { useState } from "react";
import cls from "./Sidebar.module.scss";

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
        fill
        backgroundColor="white"
        className={cls.collapseBtn}
        onClick={onToggle}
        Svg={ArrowIcon}
        clickable
      />
    </aside>
  );
};
