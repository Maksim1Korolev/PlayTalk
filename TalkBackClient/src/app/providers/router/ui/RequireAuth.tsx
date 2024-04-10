import { useCookies } from "react-cookie";

import { Navigate, useLocation } from "react-router-dom";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const [cookies] = useCookies();

  const location = useLocation();

  if (!cookies["jwt-cookie"]) {
    return <Navigate to={"/auth"} state={{ from: location }} replace />;
  }

  return children;
}
