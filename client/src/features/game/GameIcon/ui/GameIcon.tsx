import { memo, useEffect, useState } from "react";
import cls from "./GameIcon.module.scss";
import { cx } from "@/shared/lib/cx";
import { AppSvg } from "@/shared/ui";

interface GameIconProps {
  className?: string;
  gameName: string;
  onClick: () => void;
  isActive: boolean;
}

export const GameIcon = memo(
  ({ className, gameName, onClick, isActive }: GameIconProps) => {
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
      return null; //TODO: Add loader
    }

    return (
      <>
        <AppSvg
          className={cx(cls.GameIcon, {}, [className])}
          clickable
          onClick={onClick}
          width={60}
          height={60}
          Svg={IconSvg}
        />
        {isActive && "Active"}
      </>
    );
  }
);

export default GameIcon;
