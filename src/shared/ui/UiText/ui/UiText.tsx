import cls from "./UiButton.module.scss";
export type TextSize = "small" | "medium";

const UiText = ({
  classname,
  text,
  size,
}: {
  classname?: string;
  text?: string;
  size?: TextSize;
}) => {
  return <p className={cls.button}></p>;
};
