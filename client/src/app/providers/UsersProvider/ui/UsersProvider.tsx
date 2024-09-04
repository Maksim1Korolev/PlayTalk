import { User } from "@/entities/User";
import { UsersContext } from "@/shared/lib/context/UsersContext";
import { ReactNode, useMemo, useState } from "react";
// TODO: maybe fetching list here in useEffect
const UsersProvider = ({
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  const [users, setUsers] = useState<User[]>([]);

  const defaultValue = useMemo(() => ({ users, setUsers }), [users]);

  return (
    <UsersContext.Provider value={defaultValue}>
      {children}
    </UsersContext.Provider>
  );
};

export default UsersProvider;
