import { User, UserListCard } from "@/entities/User";

import { cx } from "@/shared/lib/cx";
import { Card, VStack } from "@/shared/ui";
import { memo, useEffect, useMemo, useRef } from "react";
import { sortUsers } from "../../model/userListUtils";
import cls from "./UserList.module.scss";

export interface UserListProps {
  className?: string;
  users?: User[]; // Change 'users?: User[]' to 'users: User[]'
  busy?: boolean;
  collapsed?: boolean;
  handleUserChatButton: (user: User) => void;
  handleUserPlayButton: ({
    opponentUsername,
  }: {
    opponentUsername: string;
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

export const UserList = memo(
  ({
    className,
    users,
    busy,
    collapsed,
    handleUserChatButton,
    handleUserPlayButton,
  }: UserListProps) => {
    const userRefs = useRef<(HTMLSpanElement | null)[]>([]);

    useEffect(() => {
      userRefs.current.forEach(userRef => {
        if (userRef) {
          adjustFontSize(userRef, 50); // Adjust maxWidth as needed
        }
      });
    }, [users]);

    const userList = useMemo(() => {
      const sortedUsers = users ? [...users].sort(sortUsers) : [];
      return sortedUsers?.map((user, index) => (
        <div style={{ width: "100%" }} key={user._id}>
          <UserListCard
            className={cls.userCard}
            user={user}
            busy={busy}
            collapsed={collapsed}
            handlePlayButton={handleUserPlayButton}
            handleChatButton={handleUserChatButton}
            userRef={el => (userRefs.current[index] = el)}
          />
          {index < sortedUsers.length - 1 && <hr />}
        </div>
      ));
    }, [busy, collapsed, handleUserChatButton, handleUserPlayButton, users]);

    if (!users || users.length === 0) {
      return <p>No users available.</p>;
    }

    return (
      <Card className={cx(cls.UserList, {}, [className])}>
        <VStack gap="16">{userList}</VStack>
      </Card>
    );
  }
);
