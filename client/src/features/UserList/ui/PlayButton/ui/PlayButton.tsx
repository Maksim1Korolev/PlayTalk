import { cx } from "@/shared/lib/cx";
import { ButtonProps, UiButton } from "@/shared/ui";
import cls from "./PlayButton.module.scss";
import resources from "@/shared/assets/locales/en/UserListResources.json";

//TODO:Use UiButton here and move all the props (this type could be stored in a separate file, also used in AppSvg)
export type HighlightType = "none" | "primary" | "secondary";

interface PlayButtonProps extends ButtonProps {
  className?: string;
  highlight?: HighlightType;
}

export const PlayButton = ({
  className,
  highlight = "none",
  ...buttonProps
}: PlayButtonProps) => {
  return (
    <UiButton
      className={cx(
        cls.PlayButton,
        {
          [cls.highlightPrimary]: highlight === "primary",
          [cls.highlightSecondary]: highlight === "secondary",
        },
        [className]
      )}
      {...buttonProps}
    >
      {resources.playButton}
    </UiButton>
  );
};
