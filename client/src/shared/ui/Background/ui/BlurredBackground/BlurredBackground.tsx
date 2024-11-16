import cls from "./BlurredBackground.module.scss";

import { memo } from "react";

import { cx } from "@/shared/lib";

export const BlurredBackground = memo(
  ({ className }: { className?: string }) => {
    return <div className={cx(cls.BlurredBackground, {}, [className])}></div>;
  }
);
