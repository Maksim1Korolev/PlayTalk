import { memo, useEffect, useState } from "react";
import cls from "./GameIcon.module.scss";
import { cx } from "@/shared/lib/cx";
import { AppSvg, Loader } from "@/shared/ui";

interface GameIconProps {
  className?: string;
  gameName: string;
  isActive?: boolean;
  size?: number;
  onClick: () => void;
}

export const GameIcon = memo(
  ({ className, gameName, isActive, size = 60, onClick }: GameIconProps) => {
    const [IconSvg, setIconSvg] = useState<React.FunctionComponent<
      React.SVGProps<SVGSVGElement>
    > | null>(null);

    useEffect(() => {
      const loadIcon = async () => {
        try {
          const importedIcon = await import(
            `@/shared/assets/icons/gameIcons/${gameName}-icon.svg`
          );
          setIconSvg(() => importedIcon.ReactComponent);
        } catch (error) {
          console.error(`Failed to load icon for game: ${gameName}`, error);
        }
      };

      loadIcon();
    }, [gameName]);

    if (!IconSvg) {
      return <Loader />;
    }

    return (
      <AppSvg
        className={cx(cls.GameIcon, { [cls.isActive]: isActive }, [className])}
        clickable
        onClick={onClick}
        width={size}
        height={size}
        Svg={IconSvg}
      />
    );
  }
);

export default GameIcon;
