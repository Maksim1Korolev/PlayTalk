import { memo } from "react";
import cls from "./OnlinePage.module.scss";
import { UserList } from "../../../features/UserList";
import { useQuery } from "react-query";
import { apiService } from "../api/apiUsersService";
import { User } from "../../../entities/User";
import { useCookies } from "react-cookie";

export const OnlinePage = memo(({ className }: { className?: string }) => {
  const [cookies] = useCookies(["jwt-cookie"]);
  const token = cookies["jwt-cookie"].token;

  const { data, isLoading, isError, error } = useQuery<User[], Error>(
    "users",
    () => apiService.getUsers(token)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={`${cls.OnlinePage} ${className || ""}`}>
      {data && <UserList users={data} />}
    </div>
  );
});
