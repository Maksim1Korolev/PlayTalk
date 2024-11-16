import cls from "../../styles/highlightStyles.module.scss";

export type HighlightType = "none" | "active" | "invited";

export function getHighlightClass(highlight: HighlightType) {
  const classes = [cls.highlight];

  if (highlight === "active" || highlight === "invited") {
    classes.push(cls[`highlight-${highlight}`]);
  }

  return classes.join(" ");
}
