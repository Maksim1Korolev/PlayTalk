import { memo, useEffect, useState } from "react";
import cls from "./AuthPage.module.scss";
import { UiText } from "../shared/ui/UiText";
import { Card } from "../shared/ui/Card";
import { UiInput } from "../shared/ui/UiInput";

interface AuthPageProps {
  className?: string;
}

export const AuthPage = ({ className }: AuthPageProps) => {
  const [username, setUsername] = useState("");

  const usernameOnChangeHandler = (value: string) => {
    setUsername(value);
  };
  return (
    <div className={className}>
      <Card>
        <UiText>Hello!!!</UiText>
        <UiInput value={username} onChange={usernameOnChangeHandler} />
      </Card>
    </div>
  );
};
