import { ReactNode } from "react";
import cls from "./BoardBorder.module.scss";
import { cx } from "@/shared/lib/cx";
import { Card } from "@/shared/ui";

export const BoardBorder = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <Card className={cx(cls.BoardBorder, {}, [className])} max>
      {children}
    </Card>
  );
};
