import cls from "./AuthPage.module.scss";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { authPageResources } from "@/shared/assets";

import { cx } from "@/shared/lib";
import {
  Card,
  HStack,
  Loader,
  UiButton,
  UiInput,
  UiText,
  VStack,
} from "@/shared/ui";

import { apiService } from "../api/apiAuthService";

interface AuthPageProps {
  className?: string;
}

const AuthPage = ({ className }: AuthPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["jwt-cookie"]);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };
  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const signInMutation = useMutation(
    () => apiService.login(username, password),
    {
      onSuccess: data => {
        setCookie(
          "jwt-cookie",
          { currentUsername: username, token: data.token },
          { path: "/" }
        );
        setIsAuthenticated(true);
      },
      onError: ({ response }) => {
        setError(response.data.message);
      },
    }
  );

  //TODO:Send the newly added user straight to all the clients
  const signUpMutation = useMutation(
    () => apiService.register(username, password),
    {
      onSuccess: data => {
        setCookie(
          "jwt-cookie",
          { currentUsername: username, token: data.token },
          { path: "/" }
        );
        setIsAuthenticated(true);
      },
      onError: ({ response }) => {
        setError(response.data.message);
      },
    }
  );

  const handleAuthAction = () => {
    if (isSignUp) {
      signUpMutation.mutate();
      return;
    }
    signInMutation.mutate();
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAuthAction();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      //TODO:Find replacement
      window.location.reload();
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
            {(signInMutation.isLoading || signUpMutation.isLoading) && (
              <Loader />
            )}
          </VStack>
        </VStack>
      </Card>
    </VStack>
  );
};

export default AuthPage;
