import { cx } from "@/shared/lib/cx";
import { AppImage } from "../../AppImage";
import cls from "./Avatar.module.scss";

const defaultImage = "images/default-avatar.svg";
export const Avatar = ({
  className,
  size = 80,
  src,
}: {
  className?: string;
  size?: number;
  src: string;
}) => {
  const getDefaultAvatar = () => {
    return (
      <AppImage
        className={cls.Avatar}
        width={size}
        height={size}
        src={defaultImage}
        draggable="false"
      />
    );
  };

  return (
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
