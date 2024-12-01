import cls from "./AuthPage.module.scss";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authPageResources } from "@/shared/assets";

import { cx, useAppDispatch, useAppSelector } from "@/shared/lib";
import {
  Card,
  HStack,
  Loader,
  UiButton,
  UiInput,
  UiText,
  VStack,
} from "@/shared/ui";

import { getAuthStatuses } from "../model/selectors/getAuthStatus";
import { signIn, signUp } from "../model/thunks/authThunks";

interface AuthPageProps {
  className?: string;
}

const AuthPage = ({ className }: AuthPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isSignUp, setIsSignUp] = useState(false);

  const { error, isAuthenticated, loading } = useAppSelector(getAuthStatuses);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };
  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleAuthAction = () => {
    if (isSignUp) {
      dispatch(signUp({ username, password }));
      return;
    }
    dispatch(signIn({ username, password }));
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAuthAction();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      //TODO:Find replacement for timeOut and reload
      if (isSignUp) {
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 500);
      } else {
        navigate("/");
        window.location.reload();
      }
    }
  }, [isAuthenticated]);

  return (
    <VStack
      className={cx(cls.AuthPage, {}, [className])}
      max
      align="center"
      justify="center"
    >
      <Card
        max
        className={cls.card}
        variant="default"
        padding="60"
        border="default"
      >
        <VStack gap="60" max>
          <VStack gap="8" max>
            <UiText size="l" bold fontFamily="main">
              {isSignUp
                ? authPageResources.title_sign_up
                : authPageResources.title_login}
            </UiText>
            <UiText size="m" dimmed fontFamily="main">
              {isSignUp
                ? authPageResources.subtitle_sign_up
                : authPageResources.subtitle_login}
            </UiText>
            {error && (
              <UiText className={cls.error} color="error">
                {error}
              </UiText>
            )}
          </VStack>
          <VStack gap="45" align="center" max>
            <VStack gap="24" max>
              <VStack max gap="8">
                <UiText size="l" fontFamily="text">
                  {authPageResources.label_username}
                </UiText>
                <UiInput
                  maxLength={15}
                  placeholder={authPageResources.placeholder_username}
                  value={username}
                  onChange={handleUsernameChange}
                  max
                />
              </VStack>

              <VStack max gap="8">
                <UiText size="l" fontFamily="text">
                  {authPageResources.label_password}
                </UiText>
                <UiInput
                  maxLength={30}
                  placeholder={authPageResources.placeholder_password}
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyDown}
                  max
                />
              </VStack>
            </VStack>

            <HStack gap="16">
              <UiText size="m" fontFamily="main">
                {isSignUp
                  ? authPageResources.action_already_have_account
                  : authPageResources.action_dont_have_account}
              </UiText>

              <UiButton
                variant="clear"
                color="blue"
                onClick={toggleAuthMode}
                textIsUnderlined
              >
                <UiText size="m" fontFamily="main">
                  {isSignUp
                    ? authPageResources.button_sign_in
                    : authPageResources.button_sign_up}
                </UiText>
              </UiButton>
            </HStack>
            <UiButton max variant="filled" onClick={handleAuthAction}>
              {isSignUp
                ? authPageResources.button_sign_up
                : authPageResources.button_sign_in}
            </UiButton>
            {loading && <Loader />}
          </VStack>
        </VStack>
      </Card>
    </VStack>
  );
};

export default AuthPage;
