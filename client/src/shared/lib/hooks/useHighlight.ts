import cls from "../../styles/highlightStyles.module.scss";

export type HighlightType = "none" | "primary" | "secondary";

export function getHighlightClass(highlight: HighlightType) {
  return highlight !== "none" ? cls[`highlight-${highlight}`] : "";
}
