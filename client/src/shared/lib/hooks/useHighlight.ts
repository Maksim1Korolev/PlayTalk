import { useMemo } from "react";
import cls from "../../styles/highlightStyles.module.scss";

export type HighlightType = "none" | "primary" | "secondary";

export function useHighlight(highlight: HighlightType) {
  const highlightClass = useMemo(() => {
    return highlight !== "none" ? cls[`highlight-${highlight}`] : "";
  }, [highlight]);

  return highlightClass;
}
