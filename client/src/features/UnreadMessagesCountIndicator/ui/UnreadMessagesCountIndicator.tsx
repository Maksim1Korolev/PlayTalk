import { cx } from "@/shared/lib/cx";
import cls from "./UnreadMessagesCountIndicator.module.scss";

export const UnreadMessagesCountIndicator = ({
  className,
  unreadMessagesCount,
}: {
  className?: string;
  unreadMessagesCount?: number;
}) => {
  return (
    <>
      {unreadMessagesCount && (
        <div className={cx(cls.UnreadMessageCountIndicator, {}, [className])}>
          {unreadMessagesCount}
        </div>
      )}
    </>
  );
};
