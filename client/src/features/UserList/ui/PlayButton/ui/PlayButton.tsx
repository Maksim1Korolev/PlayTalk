import resources from "@/shared/assets/locales/en/UserListResources.json";
import { HighlightType, useHighlight } from "@/shared/hooks/useHighlight";
import { cx } from "@/shared/lib/cx";
import { ButtonProps, UiButton } from "@/shared/ui";
import cls from "./PlayButton.module.scss";

interface PlayButtonProps extends ButtonProps {
  className?: string;
  highlight?: HighlightType;
}

export const PlayButton = ({
  className,
  highlight = "none",
  ...buttonProps
}: PlayButtonProps) => {
  const highlightClass = useHighlight(highlight);
  return (
    <UiButton
      className={cx(
        cls.PlayButton,
        {
          [highlightClass]: !!highlightClass,
        },
        [className]
      )}
      {...buttonProps}
    >
      {resources.playButton}
    </UiButton>
  );
};
