import cls from "./UserList.module.scss";

import { useEffect, useMemo } from "react";
import { useCookies } from "react-cookie";

import { userListResources } from "@/shared/assets";

import { cx, useAppDispatch, useAppSelector } from "@/shared/lib";
import { Card, HStack, UiText, VStack } from "@/shared/ui";

import { GameData } from "@/entities/game/Game";
import { getUsers, User } from "@/entities/User";
import { getUsersLoadingStatus } from "@/entities/User/model";
import { fetchUsersWithStatuses } from "@/entities/User/model/thunks/fetchUsersWithStatuses";

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

  useEffect(() => {
    dispatch(fetchUsersWithStatuses({ currentUsername, token }));
  }, [dispatch, currentUsername, token]);

  const userList = useMemo(() => {
    const sortedUsers = users ? Object.values(users).sort(sortUsers) : [];
    return sortedUsers?.map((user, index) => (
      <VStack max>
        <HStack max key={user.username}>
          <UserListCard
            className={cls.userCard}
            user={user}
            collapsed={collapsed}
            handlePlayButton={handleUserPlayButton}
            handleChatButton={handleUserChatButton}
          />
        </HStack>
        {index < sortedUsers.length - 1 && <hr />}
      </VStack>
    ));
  }, [collapsed, handleUserChatButton, handleUserPlayButton, users]);

  if (isLoading) {
    return (
      <Card className={cx(cls.UserList, {}, [className])} variant="blurred">
        <VStack gap="16">
          <UserListCard isLoading />
          <UserListCard isLoading />
          <UserListCard isLoading />
          <UserListCard isLoading />
        </VStack>
      </Card>
    );
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
