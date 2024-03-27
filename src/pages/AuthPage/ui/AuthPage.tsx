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

interface AuthPageProps {
  className?: string;
}

export const AuthPage = ({ className }: AuthPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // New state to toggle between sign in and sign up
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["jwt-cookie"]);

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
    <div className={cls.AuthPage}>
      <Card>
        <VStack align="center">
          <HStack gap="16">
            <UiText>Username:</UiText>
            <UiInput value={username} onChange={handleUsernameChange} />
          </HStack>

          <HStack gap="16">
            <UiText>Password:</UiText>
            <UiInput
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </HStack>
          <HStack gap="16">
            {isSignUp ? (
              <div>Already have an account?</div>
            ) : (
              <div>Don't have an account?</div>
            )}
            <UiButton onClick={toggleAuthMode}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </UiButton>
          </HStack>
          <UiButton onClick={handleAuthAction}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </UiButton>
          {(signInMutation.isLoading || signUpMutation.isLoading) && <Loader />}
        </VStack>
      </Card>
    </div>
  );
};
