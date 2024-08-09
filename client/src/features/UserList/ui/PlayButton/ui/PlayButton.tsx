import { cx } from "@/shared/lib/cx";
import { ButtonProps, UiButton } from "@/shared/ui";
import cls from "./PlayButton.module.scss";

interface PlayButtonProps extends ButtonProps {
  className?: string;
}

export const PlayButton = ({ className, ...buttonProps }: PlayButtonProps) => {
  //TODO: translate here!!!!!
  return (
    <UiButton className={cx(cls.PlayButton, {}, [className])} {...buttonProps}>
      Play
    </UiButton>
  );
};
