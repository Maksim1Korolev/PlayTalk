import { cx } from "@/shared/lib/cx";
import { ButtonProps, UiButton } from "@/shared/ui";
import cls from "./PlayButton.module.scss";
import resources from "@/shared/assets/locales/en/UserListResources.json";

interface PlayButtonProps extends ButtonProps {
  className?: string;
  highlighted: boolean;
}

export const PlayButton = ({
  className,
  highlighted,
  ...buttonProps
}: PlayButtonProps) => {
  return (
    <UiButton
      className={cx(cls.PlayButton, { [cls.highlighted]: highlighted }, [
        className,
      ])}
      {...buttonProps}
    >
      {resources.playButton}
    </UiButton>
  );
};
