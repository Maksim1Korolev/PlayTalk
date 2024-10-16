// shared/hooks/useHighlight.ts
import { useMemo } from "react";
import cls from "../styles/highlightStyles.module.scss"; // Assuming the highlight styles are stored in a shared stylesheet

export type HighlightType = "none" | "primary" | "secondary";

export function useHighlight(highlight: HighlightType) {
  const highlightClass = useMemo(() => {
    return highlight !== "none" ? cls[`highlight-${highlight}`] : "";
  }, [highlight]);

  return highlightClass;
}
