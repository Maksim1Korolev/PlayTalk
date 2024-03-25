import { memo, useEffect, useState } from "react";
import cls from "./UserOnlineIndicator.module.scss";
import { socket } from "../../../socket/socket";

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
