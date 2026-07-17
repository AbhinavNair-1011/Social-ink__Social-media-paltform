import { Navigate, Outlet } from "react-router-dom";

import Loader from "../../shared/components/Loader";

import { useMe } from "../../features/auth/hooks/useMe";
import { useEffect } from "react";
import socket from "../socket";

function ProtectedRoute() {
  const { data: user, isLoading, isError } = useMe();
  useEffect(() => {
    

    if (user) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
