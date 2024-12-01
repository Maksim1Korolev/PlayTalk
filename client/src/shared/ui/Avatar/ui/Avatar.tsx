import cls from "./Avatar.module.scss";

import { cx } from "@/shared/lib";

import { AppImage } from "../../AppImage";

const defaultImage = "images/no-avatar.svg";

export const Avatar = ({
  className,
  size = 80,
  src,
  onClick,
}: {
  className?: string;
  size?: number;
  src: string;
  onClick?: () => void;
}) => {
  const getDefaultAvatar = () => {
    return (
      <AppImage
        className={cx(cls.Avatar, {}, [className])}
        width={size}
        height={size}
        src={defaultImage}
        draggable="false"
      />
    );
  };

  return onClick ? (
    <AppImage
      className={cx(cls.Avatar, {}, [className])}
      width={size}
      height={size}
      src={src}
      onClick={onClick}
      clickable={true}
      draggable="false"
      errorFallback={getDefaultAvatar()}
    />
  ) : (
    <AppImage
      className={cx(cls.Avatar, {}, [className])}
      width={size}
      height={size}
      src={src}
      draggable="false"
      errorFallback={getDefaultAvatar()}
    />
  );
};
