import { CurrentUser, User } from "@/entities/User";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
// TODO: maybe fetching list here in useEffect
export const UsersProvider = ({
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
  const updateAllUsers = useCallback(
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
    () => ({ users, updateAllUsers, updateUser, currentUser }),
    [currentUser, updateAllUsers, updateUser, users]
  );
  return (
    <UsersContext.Provider value={defaultValue}>
      {children}
    </UsersContext.Provider>
  );
};
