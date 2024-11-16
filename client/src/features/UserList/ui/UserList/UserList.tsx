import cls from "./UserList.module.scss";

import { memo, useEffect, useMemo } from "react";
import { useCookies } from "react-cookie";

import { userListResources } from "@/shared/assets";

import { cx, useAppDispatch, useAppSelector } from "@/shared/lib";
import { Card, HStack, UiText, VStack } from "@/shared/ui";

import { GameData } from "@/entities/game/Game";
import { getUsers } from "@/entities/User";
import { getUsersLoadingStatus } from "@/entities/User/model";
import { fetchUsersWithStatuses } from "@/entities/User/model/thunks/fetchUsersWithStatuses";

import { sortUsers } from "../../utils/userListUtils";
import { UserListCard } from "../UserListCard/UserListCard";

export interface UserListProps {
  className?: string;
  collapsed?: boolean;
  handleUserChatButtonClicked: (username: string) => void;
  handleUserPlayButtonClicked: (gameData: GameData) => void;
}

export const UserList = memo(
  ({
    className,
    collapsed,
    handleUserChatButtonClicked,
    handleUserPlayButtonClicked,
  }: UserListProps) => {
    const [cookies] = useCookies();
    const { token } = cookies["jwt-cookie"];
    const currentUsername = localStorage.getItem("currentUsername");

    const dispatch = useAppDispatch();
    const users = useAppSelector(getUsers);

    const { isLoading, isError, errorMessage } = useAppSelector(
      getUsersLoadingStatus
    );

    useEffect(() => {
      if (currentUsername) {
        dispatch(fetchUsersWithStatuses({ currentUsername, token }));
      }
    }, [dispatch, currentUsername, token]);

    const userList = useMemo(() => {
      const sortedUsers = users ? Object.values(users).sort(sortUsers) : [];
      return sortedUsers?.map((user, index) => (
        <VStack max key={user.username}>
          <HStack max>
            <UserListCard
              className={cls.userCard}
              user={user}
              collapsed={collapsed}
              handlePlayButtonClicked={handleUserPlayButtonClicked}
              handleChatButtonClicked={handleUserChatButtonClicked}
            />
          </HStack>
          {index < sortedUsers.length - 1 && <hr />}
        </VStack>
      ));
    }, [
      collapsed,
      handleUserChatButtonClicked,
      handleUserPlayButtonClicked,
      users,
    ]);

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
      <Card
        className={cx(cls.UserList, {}, [className])}
        variant="blurred"
        padding="16"
      >
        <UiText size="xl">{userListResources.userListHeader}</UiText>
        <VStack gap="16" max>
          <UiText size="xl">{userListResources.userListHeader}</UiText>
          {userList}
        </VStack>
      </Card>
    );
  }
);
