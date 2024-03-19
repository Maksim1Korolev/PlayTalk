import { ReactNode } from "react";
import cls from "./Card.module.scss";

export const Card = ({ children }: { children: ReactNode }) => {
  return <div className={cls.Card}>{children}</div>;
};
