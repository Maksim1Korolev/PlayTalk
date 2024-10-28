import cls from "./UserList.module.scss"

import { useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";

import tempResources from "@/shared/assets/locales/en/OnlinePageResources.json";
import resources from "@/shared/assets/locales/en/UserListResources.json";

import { cx } from "@/shared/lib";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { Card, Loader, UiText, VStack } from "@/shared/ui";

import { getUsers, User, userActions, UserListCard } from "@/entities/User"
import { fetchUsersStatus } from "@/pages/OnlinePage/api/updateUsersStatusApiService"

import { GameData } from '@/entities/Game/model'
import { sortUsers } from "../../utils/userListUtils"

export interface UserListProps {
  className?: string;
  collapsed?: boolean;
  handleUserChatButton: (user: User) => void;
  handleUserPlayButton: ({gameData, isInviting, isActive}: {gameData: GameData, isInviting: boolean, isActive: boolean}) => void;
}

const adjustFontSize = (
  element: HTMLElement,
  maxWidth: number,
  minFontSize: number = 0.6
) => {
  let fontSize = parseFloat(window.getComputedStyle(element).fontSize);
  while (element.scrollWidth > maxWidth && fontSize > minFontSize) {
    fontSize -= 0.1;
    element.style.fontSize = `${fontSize}rem`;
  }
};

export const UserList = ({
  className,
  collapsed,
  handleUserChatButton,
  handleUserPlayButton,
}: UserListProps) => {
  const [cookies] = useCookies();
  const { user: currentUserFromCookies, token } = cookies["jwt-cookie"];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>();

  const dispatch = useAppDispatch();
  const users = useAppSelector(getUsers);

  const userRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    userRefs.current.forEach(userRef => {
      if (userRef) {
        adjustFontSize(userRef, 50); // Adjust maxWidth as needed
      }
    });
  }, [users]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const upToDateUsers = await fetchUsersStatus({
          currentUser: currentUserFromCookies,
          token,
          setError,
          setIsError,
          setIsLoading,
        });

        dispatch(
          userActions.initializeUsers({
            users: upToDateUsers,
            currentUser: currentUserFromCookies,
          })
        );
      } catch (error) {
        console.error("Error fetching users status:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, currentUserFromCookies, token]);

  const userList = useMemo(() => {
    const sortedUsers = users ? [...users].sort(sortUsers) : [];
    return sortedUsers?.map((user, index) => (
      <div style={{ width: "100%" }} key={user._id}>
        <UserListCard
          className={cls.userCard}
          user={user}
          collapsed={collapsed}
          handlePlayButton={handleUserPlayButton}
          handleChatButton={handleUserChatButton}
          userRef={el => (userRefs.current[index] = el)}
        />
        {index < sortedUsers.length - 1 && <hr />}
      </div>
    ));
  }, [collapsed, handleUserChatButton, handleUserPlayButton, users]);

  if (!users || users.length === 0) {
    return <p>{resources.noUsers}</p>;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError && error) {
    {
      return (
        <UiText>{`${tempResources.errorMessagePrefix} ${error.message}`}</UiText>
      );
    }
  }

  return (
    <Card className={cx(cls.UserList, {}, [className])} variant='blurred'>
      <UiText size="xl">{resources.userListHeader}</UiText>
      <VStack gap="16">{userList}</VStack>
    </Card>
  );
};
