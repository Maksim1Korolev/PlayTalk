import cls from "./AuthPage.module.scss";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
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
import { cx } from "@/shared/lib/cx";

import resources from "@/shared/assets/locales/en/AuthPageResources.json";

interface AuthPageProps {
  className?: string;
}

export const AuthPage = ({ className }: AuthPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
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
      onSuccess: (data) => {
        setCookie("jwt-cookie", data, { path: "/" });
        setIsAuthenticated(true);
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const signUpMutation = useMutation(
    () => apiService.register(username, password),
    {
      onSuccess: (data) => {
        setCookie("jwt-cookie", data, { path: "/" });
        setIsAuthenticated(true);
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const handleAuthAction = () => {
    if (isSignUp) {
      signUpMutation.mutate();
    } else {
      signInMutation.mutate();
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      window.location.reload();
    }
  }, [isAuthenticated, navigate]);

  return (
    <VStack className={cx(cls.AuthPage)} max align="center" justify="center">
      <Card max className={cls.card} variant="outlined" padding="32">
        <VStack gap="32">
          <VStack gap="8" max>
            <UiText size="l" bold>
              {isSignUp ? resources.title_sign_up : resources.title_login}
            </UiText>
            <UiText size="m" dimmed>
              {isSignUp ? resources.subtitle_sign_up : resources.subtitle_login}
            </UiText>
          </VStack>
          <VStack gap="24" align="center" max>
            <UiInput
              placeholder={resources.placeholder_username}
              value={username}
              label={resources.label_username}
              onChange={handleUsernameChange}
              max
            />

            <UiInput
              placeholder={resources.placeholder_password}
              label={resources.label_password}
              type="password"
              value={password}
              onChange={handlePasswordChange}
              max
            />

            <HStack gap="16">
              {isSignUp ? (
                <div>{resources.action_already_have_account}</div>
              ) : (
                <div>{resources.action_dont_have_account}</div>
              )}
              <UiButton
                variant="clear"
                color="blue"
                onClick={toggleAuthMode}
                textIsUnderlined
              >
                {isSignUp ? resources.button_sign_in : resources.button_sign_up}
              </UiButton>
            </HStack>
            <UiButton variant="filled" onClick={handleAuthAction}>
              {isSignUp ? resources.button_sign_up : resources.button_sign_in}
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
