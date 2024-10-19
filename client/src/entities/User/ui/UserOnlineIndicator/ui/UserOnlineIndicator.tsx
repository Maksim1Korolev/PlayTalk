import { cx } from "@/shared/lib";
import cls from "./UserOnlineIndicator.module.scss";

export const UserOnlineIndicator = ({
  className,
  isOnline = false,
}: {
  className?: string;
  isOnline?: boolean;
}) => {
  return (
    <span
      className={cx(cls.UserOnlineIndicator, { [cls.active]: isOnline }, [
        className,
      ])}
    ></span>
  );
};
