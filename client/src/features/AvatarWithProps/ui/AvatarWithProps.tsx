import { cx } from "@/shared/lib";
import { Avatar } from "@/shared/ui/Avatar";
import { memo } from "react";
import cls from "./AvatarWithProps.module.scss";
interface AvatarWithPropsBase {
  className?: string;
  avatarSrc: string;
  size?: number;
  addonTopRight?: React.ReactNode;
  addonBottomRight?: React.ReactNode;
  addonTopLeft?: React.ReactNode;
  addonBottomLeft?: React.ReactNode;
}

interface ImageProps extends AvatarWithPropsBase {
  clickable?: false;
}
interface ClickableImageProps extends AvatarWithPropsBase {
  clickable: true;
  onClick: () => void;
}

type AvatarWithPropsProps = ImageProps | ClickableImageProps;

export const AvatarWithProps = memo((props: AvatarWithPropsProps) => {
  const {
    className,
    avatarSrc,
    size = 80,
    addonTopRight,
    addonBottomRight,
    addonTopLeft,
    addonBottomLeft,
    clickable,
  } = props;

  const avatar = (
    <div className={cls.AvatarWithProps}>
      <Avatar
        className={cx(cls.avatar, {}, [className])}
        src={avatarSrc}
        size={size}
      />
      <div className={cls.addonTopRight}>{addonTopRight}</div>
      <div className={cls.addonBottomRight}>{addonBottomRight}</div>
      <div className={cls.addonTopLeft}>{addonTopLeft}</div>
      <div className={cls.addonBottomLeft}>{addonBottomLeft}</div>
    </div>
  );

  if (clickable) {
    return (
      <button
        style={{ width: size, height: size }}
        type="button"
        className={cx(cls.button, {}, [className])}
        onClick={props.onClick}
      >
        {avatar}
      </button>
    );
  }
  return avatar;
});
