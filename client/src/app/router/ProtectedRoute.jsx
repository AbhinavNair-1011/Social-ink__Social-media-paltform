import { Navigate, Outlet } from "react-router-dom";

import Loader from "../../shared/components/Loader";

import { useMe } from "../../features/auth/hooks/useMe";

function ProtectedRoute() {
  const {
    data: user,
    isLoading,
    isError,
  } = useMe();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;