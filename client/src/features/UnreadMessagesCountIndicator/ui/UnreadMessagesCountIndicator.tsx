import cls from "./UnreadMessagesCountIndicator.module.scss";
import { cx } from "@/shared/lib";

export const UnreadMessagesCountIndicator = ({
  className,
  unreadMessagesCount,
}: {
  className?: string;
  unreadMessagesCount?: number;
}) => {
  if (!unreadMessagesCount || unreadMessagesCount === 0) return null;
  return (
    <div className={cx(cls.UnreadMessageCountIndicator, {}, [className])}>
      {unreadMessagesCount}
    </div>
  );
};
