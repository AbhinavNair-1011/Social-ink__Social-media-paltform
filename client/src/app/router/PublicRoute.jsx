import { Navigate, Outlet } from "react-router-dom";

import Loader from "../../shared/components/Loader";

import { useMe } from "../../features/auth/hooks/useMe";

function PublicRoute() {
  const {
    data: user,
    isLoading,
  } = useMe();

  if (isLoading) {
    return <Loader />;
  }

  if (user) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;