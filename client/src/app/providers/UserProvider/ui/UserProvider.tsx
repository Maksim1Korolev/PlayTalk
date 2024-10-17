import { CurrentUser, User } from "@/entities/User";
import { UserContext } from "@/shared/lib/context/UserContext";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
// TODO: maybe fetch the list of users here in useEffect
export const UserProvider = ({
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  const [cookies] = useCookies();
  const currentUserFromCookies = cookies["jwt-cookie"]?.user;
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser>();

  useEffect(() => {
    if (!currentUser && currentUserFromCookies) {
      const newCurrentUser: CurrentUser = {
        username: currentUserFromCookies.username,
        _id: currentUserFromCookies._id,
      };
      setCurrentUser(newCurrentUser);
    }
  }, [currentUserFromCookies]);

  const updateUser = useCallback(
    (username: string, updatedProps: Partial<User>) => {
      setUsers((prevUsers: User[]) => {
        if (!prevUsers) return [];

        return prevUsers.map(user => {
          if (user.username === username) {
            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              _id,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              username,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              avatarFileName,
              ...allowedProps
            }: Partial<User> = updatedProps;
            return { ...user, ...allowedProps };
          }

          return user;
        });
      });
    },
    [setUsers]
  );
  const initializeUsers = useCallback(
    (users: User[]) => {
      if (!currentUserFromCookies) return;

      const otherUsers = users.filter(
        (user: User) => user.username !== currentUserFromCookies.username
      );

      const newCurrentUser = users.find(
        user => user.username === currentUserFromCookies.username
      );

      setUsers(otherUsers || []);
      setCurrentUser(newCurrentUser);
    },
    [currentUserFromCookies, setCurrentUser]
  );

  const defaultValue = useMemo(
    () => ({ users, initializeUsers, updateUser, currentUser }),
    [currentUser, initializeUsers, updateUser, users]
  );
  return (
    <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>
  );
};
