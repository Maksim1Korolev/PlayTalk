import cls from "./UserList.module.scss";

import { useEffect, useMemo, useRef } from "react";
import { useCookies } from "react-cookie";

import { userListResources } from "@/shared/assets";

import { cx, useAppDispatch, useAppSelector } from "@/shared/lib";
import { Card, Loader, UiText, VStack } from "@/shared/ui";

import { GameData } from "@/entities/game/Game";
import {
  fetchUsersWithStatuses,
  getUsers,
  getUsersLoadingStatus,
  User,
} from "@/entities/User";

import { sortUsers } from "../../utils/userListUtils";
import { UserListCard } from "../UserListCard/UserListCard";

export interface UserListProps {
  className?: string;
  collapsed?: boolean;
  handleUserChatButton: (user: User) => void;
  handleUserPlayButton: ({
    gameData,
    isInviting,
    isActive,
  }: {
    gameData: GameData;
    isInviting: boolean;
    isActive: boolean;
  }) => void;
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
  const { currentUsername, token } = cookies["jwt-cookie"];

  const dispatch = useAppDispatch();
  const users = useAppSelector(getUsers);

  const { isLoading, isError, errorMessage } = useAppSelector(
    getUsersLoadingStatus
  );

  const userRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    userRefs.current.forEach(userRef => {
      if (userRef) {
        adjustFontSize(userRef, 50);
      }
    });
  }, [users]);

  useEffect(() => {
    dispatch(fetchUsersWithStatuses({ currentUsername, token }));
  }, [dispatch, currentUsername, token]);

  const userList = useMemo(() => {
    const sortedUsers = users ? Object.values(users).sort(sortUsers) : [];
    return sortedUsers?.map((user, index) => (
      <div style={{ width: "100%" }} key={user.username}>
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

  if (isLoading) {
    return <Loader />;
  }

  if (isError && errorMessage) {
    return (
      <UiText>{`${userListResources.errorMessagePrefix} ${errorMessage}`}</UiText>
    );
  }

  if (!users || Object.keys(users).length === 0) {
    return <p>{userListResources.noUsers}</p>;
  }

  return (
    <Card className={cx(cls.UserList, {}, [className])} variant="blurred">
      <UiText size="xl">{userListResources.userListHeader}</UiText>
      <VStack gap="16">{userList}</VStack>
    </Card>
  );
};
