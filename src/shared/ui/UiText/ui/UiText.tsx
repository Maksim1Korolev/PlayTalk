import { ReactNode } from "react";
import cls from "./UiText.module.scss";
export type TextSize = "small" | "medium";

export const UiText = ({
  children,
  classname,
  size = "medium",
}: {
  children?: ReactNode;
  classname?: string;
  size?: TextSize;
}) => {
  const className: string = `${classname}${cls[size]} `;
  return <p className={className}>{children}</p>;
};
