import { cx } from "@/shared/lib/cx";
import { ButtonProps, UiButton } from "@/shared/ui";
import cls from "./PlayButton.module.scss";

interface PlayButtonProps extends ButtonProps {
  className?: string;
  highlighted: boolean;
}

export const PlayButton = ({
  className,
  highlighted,
  ...buttonProps
}: PlayButtonProps) => {
  //TODO: translate here!!!!!
  return (
    <UiButton
      className={cx(cls.PlayButton, { [cls.highlighted]: highlighted }, [
        className,
      ])}
      {...buttonProps}
    >
      Play
    </UiButton>
  );
};
