import cls from "./UnreadMessagesCountIndicator.module.scss";

import { cx } from "@/shared/lib";

export const UnreadMessagesCountIndicator = ({
  className,
  unreadMessagesCount,
}: {
  className?: string;
  unreadMessagesCount?: number;
}) => {
  //if (!unreadMessagesCount || unreadMessagesCount === 0) return null;
  return (
    <p className={cx(cls.UnreadMessageCountIndicator, {}, [className])}>6</p>
  );
};
