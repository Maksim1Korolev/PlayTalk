import cls from "../../styles/highlightStyles.module.scss";

export type HighlightType = "none" | "active" | "invited";

export function getHighlightClass(highlight: HighlightType) {
  return highlight !== "none" ? cls[`highlight-${highlight}`] : "";
}
