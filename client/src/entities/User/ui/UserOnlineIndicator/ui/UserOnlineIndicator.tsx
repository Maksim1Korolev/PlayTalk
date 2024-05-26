import cls from "./UserOnlineIndicator.module.scss";

export const UserOnlineIndicator = ({
  className,
  isOnline = false,
}: {
  className?: string;
  isOnline: boolean;
}) => {
  return (
    <p className={`${cls.UserOnlineIndicator} ${className}`}>
      {`Connected: ${isOnline}`}
    </p>
  );
};
