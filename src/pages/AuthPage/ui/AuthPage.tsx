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
} from "../../../shared/ui";
import { apiService } from "../api/apiAuthService";
import { cx } from "@/shared/lib/cx";

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
      <Card variant="outlined" padding="24">
        <VStack gap="24" align="center">
          <UiInput
            placeholder="Enter your username"
            value={username}
            label="Username"
            onChange={handleUsernameChange}
          />

          <UiInput
            placeholder="••••••••"
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />

          <HStack gap="16">
            {isSignUp ? (
              <div>Already have an account?</div>
            ) : (
              <div>Don't have an account?</div>
            )}
            <UiButton variant="clear" color="blue" onClick={toggleAuthMode}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </UiButton>
          </HStack>
          <UiButton variant="filled" onClick={handleAuthAction}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </UiButton>
          {(signInMutation.isLoading || signUpMutation.isLoading) && <Loader />}
        </VStack>
      </Card>
    </VStack>
  );
};
