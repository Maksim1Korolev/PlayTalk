import { memo, useEffect, useState } from "react";
import cls from "./AuthPage.module.scss";
import { UiText } from "../../../shared/ui/UiText";
import { Card } from "../../../shared/ui/Card";
import { UiInput } from "../../../shared/ui/UiInput";
import { UiButton } from "../../../shared/ui/UiButton/ui/UiButton";
import { HStack, VStack } from "../../../shared/ui/Stack";

interface AuthPageProps {
  className?: string;
}

export const AuthPage = ({ className }: AuthPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usernameOnChangeHandler = (value: string) => {
    setUsername(value);
  };
  const passwordOnChangeHandler = (value: string) => {
    setPassword(value);
  };

  const HandleSignIn = () => {};

  return (
    <div className={className}>
      <Card>
        <VStack align="center">
          <HStack gap="16">
            <UiText>Username:</UiText>
            <UiInput value={username} onChange={usernameOnChangeHandler} />
          </HStack>

          <HStack gap="16">
            <UiText>Password:</UiText>
            <UiInput
              type="password"
              value={password}
              onChange={passwordOnChangeHandler}
            />
          </HStack>
          <UiButton onClick={HandleSignIn}>Sign In</UiButton>
        </VStack>
      </Card>
    </div>
  );
};
